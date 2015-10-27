# How to build the ervauka npm-package and docker-image

## jenkins job

our private jenkins-server located at 172.18.85.101 has a job configured which will build, test and publish the package to
the private registry, so you should leave the package-publishing step to jenkins. 

## npm-package

The registry is located (here)[1]. First you have to register according to (this documentation)[2]. Now you can update
your npm configuration

	npm set registry https://docker.ub.intern.uni-leipzig.de/npm/

And log in

	npm login
	
after that you can publish the package with

	npm publish
	
keep in mind that you will have to bump the version in `package.json` in order to publish regularly

## docker-image

we dont have a private docker repository for now, so we dont publish our images, rather than copying them over to the
docker-host where the image is used to run the service.

### building the image

is easy. there is a `Dockerfile` inside the package which we can use to build the image

	docker build --no-cache -t useltmann/ervauka .
	
this builds an image without using cache which is necessary in order to fetch the new npm-package from our npm registry.
Therefore its necessary as well to build and publish the npm-package first since the docker-image takes the ervauka-package 
from the private npm-repository

### transfering the image

after successful build you have to transfer the image to the designated docker-host.

	docker save useltmann/ervauka | ssh docker.host docker load
	
this should transfer the image to docker.host's docker daemon

[1]: https://docker.ub.intern.uni-leipzig.de/npm/
[2]: todo
