# vim:set ft=dockerfile:

# Docs generation Dockerfile

FROM scalebox/atuin-flask-webdev

MAINTAINER Paolo Casciello <paolo.casciello@scalebox.it>

RUN mkdir /workspace
WORKDIR /workspace/docs

RUN pip install -U sphinx sphinx-autobuild

CMD sphinx-autobuild -H 0.0.0.0 -p 9999 . _build/html
