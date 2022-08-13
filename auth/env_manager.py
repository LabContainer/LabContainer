# Manages docker env
import subprocess
import os


def create_new_container(user: str, password: str):
    # TODO: use kubernetes here
    # Build container image for user
    wd = os.getcwd()
    os.chdir(os.path.join(wd, 'auth/student-env'))
    print("Building user image...")
    buildcmd = subprocess.run(["docker", "build", "--build-arg",
                              f"ssh_user={user}", "--build-arg", f"ssh_pass={password}", "-t", f"studentenv:{user}", "."], capture_output=True)
    os.chdir(wd)

    # Start container
    name = f"env_{user}"
    network = "envnet"
    print(f"Starting new container: {name} in {network} network")
    # "-p", f"{port}:22" to access via port
    container = subprocess.run(
        ["docker", "run",  "-d", "--network", network, "--name", name, f"studentenv:{user}"], capture_output=True)
    if container.stderr:
        raise RuntimeError(container.stderr)
    container_id = container.stdout.decode('utf8').strip()
    print("Created container on host: ", container_id)
    return [container_id, network, name]


def kill_env(container_id: str):
    removed = subprocess.run(
        ["docker", "rm", container_id.strip(), "-f"], capture_output=True)
    if removed.stderr:
        raise RuntimeError(removed.stderr)
