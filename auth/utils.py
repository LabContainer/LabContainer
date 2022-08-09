import socket
from contextlib import closing

import subprocess
import os
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


def make_env(port):
    # TODO: use kubernetes here
    container_id = subprocess.Popen(
        ["docker", "run",  "-d", "-p", f"{port}:22", "student-env_dev"])


def kill_env(container_id: str):
    subprocess.Popen(["docker", "kill", container_id])
