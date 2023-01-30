# Manages docker env
import subprocess
import os
import json
from analytics.logger import logger

# TODO: use kubernetes here


def get_image_name(user: str, team: str):
    return f"envimage_{user}_{team}".lower()


def build_env(user: str, team: str, init_script: str):
    # Build container image for user
    wd = os.getcwd()
    os.chdir(os.path.join(wd, "student-manager-service"))
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
    )
    if buildcmd.stderr:
        raise RuntimeError(buildcmd.stderr)
    os.chdir(wd)
    return image


def create_new_container(user: str, team: str, port: int, image: str):
    # Start container
    name = f"env_{user}_{team}"
    network = "envnet"
    logger.info(f"Starting new container: {name} in {network} network")
    # "-p", f"{port}:22" to access via port
    if check_env(name):
        kill_env(name)
    wd = os.getcwd()
    container = subprocess.run(
        [
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
            # debuging volume
            # "-v",
            # f"/home/parth/Documents/Github/CodeCapture/student-manager-service/dist:/app/dist",
            image,
        ],
        capture_output=True,
    )
    if container.stderr:
        raise RuntimeError(container.stderr)
    container_id = container.stdout.decode("utf8").strip()
    logger.info(f"Created container on host: {container_id}")
    return [container_id, network, name]


def check_env(name: str):
    cont = subprocess.run(
        ["docker", "container", "inspect", name], capture_output=True)
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
    images = subprocess.run(
        ["docker", "image", "ls", "-q", image], capture_output=True
    )
    if images.stderr:
        raise RuntimeError(images.stderr)
    if images.stdout.decode("utf8").strip() == "":
        return False
    return True
