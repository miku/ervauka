FROM node:latest
MAINTAINER seltmann@ub.uni-leipzig.de
COPY . /app
RUN cd /app; npm install
EXPOSE 3000
ENV NODE_ENV=staging
ENV URI=file:///app/test/rvk.xml
RUN chmod a+x /app/bin/www
CMD ["/app/bin/www"]