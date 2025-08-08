FROM ubuntu:22.04
WORKDIR /tmp/wstunnel

RUN apt update && apt-get upgrade -y
RUN apt-get install wget -y
RUN wget https://github.com/erebe/wstunnel/releases/download/v10.4.4/wstunnel_10.4.4_linux_amd64.tar.gz
RUN tar -xvzf wstunnel_10.4.4_linux_amd64.tar.gz
RUN chmod +x wstunnel
RUN cp wstunnel /usr/local/bin/wstunnel

EXPOSE 8000
CMD wstunnel server ws://[::]:8000 --restrict-to 172.20.0.4:51820
