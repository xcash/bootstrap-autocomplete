FROM avatarla/node-gulp-bower2
MAINTAINER Paolo Casciello <paolo.casciello@scalebox.it>

# copy required files
COPY ./package.json /workspace/
COPY ./gulpfile.js /workspace/
COPY ./webpack.config.js /workspace/
COPY ./tsconfig.json /workspace/
COPY ./typings.json /workspace/
COPY ./typings /workspace/

ENV NODE_ENV development

# install dependecies
RUN npm update --dev

# install typings
# RUN node_modules/.bin/typings install --global --save dt~jquery

# dev webserver port
EXPOSE 8000
EXPOSE 35729

# watch
CMD ["gulp", "monitor"]
