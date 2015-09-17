FROM node:0.10
MAINTAINER seltmann@ub.uni-leipzig.de
RUN npm set registry http://docker.ub.intern.uni-leipzig.de/npm \
 && npm install -g ervauka
EXPOSE 3000
ENV NODE_ENV=staging
CMD ["ervauka"]
