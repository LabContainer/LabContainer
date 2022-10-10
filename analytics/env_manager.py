# Manages docker env
import subprocess
import os


def create_new_container(user: str, team: str, password: str, port: int):
    # TODO: use kubernetes here
    # Build container image for user
    wd = os.getcwd()
    os.chdir(os.path.join(wd, "student-manager-service"))
    print("Building user image...")
    buildcmd = subprocess.run(
        [
            "docker",
            "build",
            "--build-arg",
            f"ssh_user={user}",
            "--build-arg",
            f"ssh_pass={password}",
            "-t",
            f"studentenv:{user}",
            ".",
        ],
        capture_output=True,
    )
    if buildcmd.stderr:
        raise RuntimeError(buildcmd.stderr)
    os.chdir(wd)

    # Start container
    name = f"env_{user}_{team}"
    network = "envnet"
    print(f"Starting new container: {name} in {network} network")
    # "-p", f"{port}:22" to access via port
    if check_env(name):
        kill_env(name)
    print(os.path.join(wd, 'student-manager-service'))
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
            # debuging volume
            # "-v",
            # f"/home/parth/Documents/Github/CodeCapture/student-manager-service/dist:/app/dist",
            f"studentenv:{user}",
        ],
        capture_output=True,
    )
    if container.stderr:
        raise RuntimeError(container.stderr)
    container_id = container.stdout.decode("utf8").strip()
    print("Created container on host: ", container_id)
    return [container_id, network, name]


def check_env(name: str) -> bool:
    cont = subprocess.run(
        ["docker", "container", "inspect", name], capture_output=True)
    return cont.stdout.decode("utf8").strip() != "[]"


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
