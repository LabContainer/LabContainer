apt update
apt install iproute2 -y
echo "`ip route | awk '/default/ { print $3 }'`\tdocker.host.internal" >> /etc/hosts