# Ervauka

Ervauka is a service app which provides a simple API for browsing the RVK notation hierarchy.

In order to use it, you'll need the XML file that contains the hierarchy structure of the categorisation and which is handed out
by the University of Regensburg.

For further information read [here][1].

## Prerequisites

### nodejs

The application is written in JavaScript and makes use of [nodejs][2]. So first you have to install this piece of software.
Please refer to the projects documentation on how to do this for your running operating system.

## Installation

### via source code

The project is open source and therefore hosted on [github.com][3]. To checkout type
 
	git clone https://github.com/useltmann/ervauka.git

#### install dependencies

Change into the applications folder and type:

	npm install

#### start the service

To start with local copy of the xml file type:

	node bin/ervauka file:///path/to/rvk.xml

### via npm

In order to install via node's package manager [npm][4] you need access to the [UBL's package registry][5].
As root do

	npm --registry https://docker.ub.intern.uni-leipzig.de/npm/ install -g ervauka

#### start the service

To start the service type:

	ervauka file:///path/to/rvk.xml

## provide the service with the RVK-XML

To start with local copy of the xml file type:

	ervauka file:///path/to/rvk.xml

or with a remote location accessable with http or https type:

	ervauka http://remote.host/providing/rvk.xml

Alternatively you can provide the location by an environment variable 'URI'

	URI=file://$(pwd)/rvk.xml ervauka
 
## integrate into website

to use this service in your website and you have to set up your html-code as follows

 * add jquery
 * add jquery-ui
 * add ervauka.js, e.g. localhost:3000/ervauka.js
 * add script initiation according to public/index.html

		var options = {
			speed: 200, 					# optional, the milliseconds for animation effects
			json: {							# required, describes the url and path to use for querying the ervauka service   
				baseUrl: 'https://api.host',	# required, the path to the 'getchilds' REST call of ervauka service
				func: rvk_init,				# optional, the function to use to query the ervauka service and build the html elements
				params: {					# optional, describes the params sent to ervauka service
					depth: 0				# optional, the dimensional depth the children are collected and returned
				}
			},
			open: '',						# optional, the xpath of the notation element that shall be opened on startup
			eventType: 'click',				# optional, which event is listened to that triggers the service query
			eventHandler: toggle,			# optional, which event handler shall react on event trigger
			root: '#rvk-tree',				# optional, defines the jquery-id of the element that holds the rvk tree
			bcroot: '#rvk-breakcrumb',		# optional, defines the jquery-id of the element that holds the breadcrumbs
			notationsToHide: ['B', 'K']		# optional, the notations which shall be hidden
		};
		
		Rvk.setConfig(options);
		
		var browseType = tree;				# required, has to be one of 'tree' or 'slide'
		
		Rvk.init(browseType);

[1]: http://rvk.uni-regensburg.de/
[2]: http://nodejs.org/
[3]: https://github.com/finc
[4]: https://www.npmjs.com/
[5]: http://docker.ub.intern.uni-leipzig.de/npm/

