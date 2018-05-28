FROM avatarla/node-gulp-bower2
MAINTAINER Paolo Casciello <paolo.casciello@scalebox.it>

# copy package file
COPY ./package.json /workspace/

ENV NODE_ENV development

# install dependecies
RUN npm update --dev

# copy required files
COPY ./gulpfile.js /workspace/
COPY ./webpack.config.js /workspace/
COPY ./tsconfig.json /workspace/

# dev webserver port
EXPOSE 8000
EXPOSE 35729

# watch
CMD ["gulp", "monitor"]
