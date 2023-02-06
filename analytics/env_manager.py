# Manages docker env
import subprocess
import os
import json
from analytics.logger import logger

# TODO: use kubernetes here


def get_image_name(user: str, team: str):
    # remvoe special characters
    user = user.replace(" ", "_")
    team = team.replace(" ", "_")
    return f"envimage_{user}_{team}".lower()


def build_env(user: str, team: str, init_script: str):
    # Build container image for user
    # wd = os.getcwd()
    # os.chdir(os.path.join(wd, "student-manager-service"))
    image = get_image_name(user, team)
    logger.info(f"Building user image... {image}")
    # TODO use .env for security
    buildcmd = subprocess.run(
        [
            "docker",
            "build",
            "--build-arg",
            f"init_script={init_script}",
            "--build-arg",
            f"user={user}",
            "-t",
            image,
            ".",
        ],
        capture_output=True,
        cwd=os.path.join(os.getcwd(), "student-manager-service"),
    )
    # os.chdir(wd)
    if buildcmd.stderr:
        raise RuntimeError(buildcmd.stderr)
    return image


def create_new_container(user: str, team: str, port: int, image: str):
    # To debug student-manager-service, run tsc -w in student-manager-service
    debug_container = False
    # Start container
    name = f"env_{user}_{team}".replace(" ", "_").lower()
    network = "envnet"
    logger.info(f"Starting new container: {name} in {network} network")
    # "-p", f"{port}:22" to access via port
    if check_env(name):
        kill_env(name)
    start_command = [
        "docker",
        "run",
        "-d",
        "-p",
        f"{port}:8090",
        "--network",
        network,
        "--name",
        name,
        "-e",
        f"CONTAINER_NAME={name}",
        # pass env
        "-e",
        f"ENVIRONMENT={os.getenv('ENVIRONMENT')}",
        image,
    ]
    # Add debuging volume if env is dev
    if os.getenv("ENVIRONMENT") == "development" and debug_container:
        # student_manager_service_path = os.path.join(wd, "student-manager-service")
        student_manager_service_path = (
            "/home/parth/work/LabContainer/student-manager-service"
        )
        debug_args = [
            # debuging volume
            "-v",
            f"{student_manager_service_path}/dist:/app/dist",
        ]
        start_command = start_command[:2] + debug_args + start_command[2:]
    container = subprocess.run(start_command, capture_output=True)
    if container.stderr:
        raise RuntimeError(container.stderr)
    container_id = container.stdout.decode("utf8").strip()
    logger.info(f"Created container on host: {container_id}")
    return [container_id, network, name]


def check_env(name: str):
    cont = subprocess.run(["docker", "container", "inspect", name], capture_output=True)
    string = cont.stdout.decode("utf8").strip()
    if string == "[]":
        return None
    status = json.loads(string)
    return status[0]["State"]["Running"]


def check_env_id(conatiner_id: str) -> bool:
    dockerps = subprocess.run(["docker", "ps", "-q"], capture_output=True)
    running_ids = dockerps.stdout.decode("utf8").strip().split("\n")
    for rid in running_ids:
        if conatiner_id.startswith(rid):
            return True
    return False


def kill_env(container_id: str):
    removed = subprocess.run(
        ["docker", "rm", container_id.strip(), "-f"], capture_output=True
    )
    if removed.stderr:
        raise RuntimeError(removed.stderr)


def commit_env(container_id: str, user: str, team: str):
    image_name = get_image_name(user, team)
    logger.info(f"Commiting container: {container_id} to image: {image_name}")
    commit = subprocess.run(
        ["docker", "commit", container_id, image_name], capture_output=True
    )
    if commit.stderr:
        raise RuntimeError(commit.stderr)
    return image_name


def check_image(image: str):
    """
    Function to check if docker image already exists based on image name and tag
    """
    images = subprocess.run(["docker", "image", "ls", "-q", image], capture_output=True)
    if images.stderr:
        raise RuntimeError(images.stderr)
    if images.stdout.decode("utf8").strip() == "":
        return False
    return True
