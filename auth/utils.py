import socket
from contextlib import closing

import subprocess
import os
from sys import stderr
import jwt
import dotenv

env_path = os.path.abspath(os.path.join(os.getenv('PYTHONPATH'), '..', '.env'))
dotenv.load_dotenv(dotenv_path=env_path)


def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(('', 0))
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]


def verify_jwt(token: str):
    header_data = jwt.get_unverified_header(token)
    print(os.environ['SECRET_TOKEN'])
    return jwt.decode(
        token,
        key=os.environ['SECRET_TOKEN'],
        algorithms=[header_data['alg'], ]
    )


def make_env(port: str, user: str, password: str):
    # TODO: use kubernetes here
    # Build container
    wd = os.getcwd()
    os.chdir(os.path.join(wd, 'auth/student-env'))
    print("Building user image...")
    buildcmd = subprocess.run(["docker", "build", "--build-arg",
                              f"ssh_user={user}", "--build-arg", f"ssh_pass={password}", "-t", f"studentenv:{user}", "."], capture_output=True)
    print(buildcmd)
    os.chdir(wd)
    print("Built image")
    # Start container
    container = subprocess.run(
        ["docker", "run",  "-d", "--network", "envnet", "--name", f"env_{user}", "-p", f"{port}:22", f"studentenv:{user}"], capture_output=True)
    if container.stderr:
        print(container.stderr)
        raise RuntimeError(container.stderr)
    container_id = container.stdout.decode('utf8')
    print("Created container on host: ", container_id)
    print("Connecting container to network: envnet")
    return container_id


def kill_env(container_id: str):
    subprocess.Popen(["docker", "kill", container_id])
