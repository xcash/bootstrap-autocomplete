FROM node
MAINTAINER Paolo Casciello <paolo.casciello@scalebox.it>

ENV NODE_ENV development

WORKDIR /workspace

RUN npm install yarn --global
RUN yarn global add gulp


# copy package file
COPY ./package.json /workspace/

# install dependecies
# RUN npm update --dev
RUN yarn install

# copy required files
COPY ./gulpfile.js /workspace/
COPY ./webpack.config.js /workspace/
COPY ./tsconfig.json /workspace/

# dev webserver port
EXPOSE 3000
EXPOSE 3001

# watch
CMD ["gulp", "monitor"]
