FROM ubuntu:latest

RUN apt update && apt install  openssh-server sudo -y

ARG ssh_user=test
ARG ssh_pass=test
ARG init_script="echo Test Script"

RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1000 ${ssh_user} 


RUN  echo $ssh_user:$ssh_pass | chpasswd

RUN service ssh start

EXPOSE 22

RUN ${init_script}

SHELL ["/bin/bash", "-c"] 

CMD ["/usr/sbin/sshd","-D"]