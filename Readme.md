# Ervauka

Ervauka is a service app which provides a simple api for browsing the RVK notation hierarchy.

In order to use you need the XML file that contains the hierarchy structure of the categorisation and which is handed out
by the University of Regensburg

for further information read [here][1]

## Installation

### nodejs

The application is written in JavaScript and makes use of [nodejs][2]. So first you have to install this peace of software.
Please refer to the projects documentation on how to do this for your running operating system.

### source code

the project is open source and therefore hosted on [github.com][3]. To checkout type
 
		git clone https://github.com/

### install dependencies

change into the applications folder and type

		npm install
		
## start the service

to start with local copy of the xml file type

		node bin/www file:///path/to/rvk.xml
		
or with a remote location accessable with http or https type

		node bin/www http://remote.host/providing/rvk.xml

alternatively you can provide the location by an environment variable 'URI'

		URI=file://$(pwd)/rvk.xml node bin/www
		 
		 
[1]: http://rvk.uni-regensburg.de/
[2]: http://nodejs.org/
[3]: https://github.com/finc
