Rvk = (function ($) {

	config = {
		speed: 200,
		multiFolder: true,
		loadMessage: 'Loading...',
		open: '',
		eventHandler: function () {
		},
		eventType: 'click',
		root: '#rvk-tree',
		breadcrumbroot: '#rvk-breadcrumb',
	};

	active = {
		id: null,
		notation: null,
	};

	var _parseOpenXpath = function (xpath) {
		if (!xpath) {
			return [];
		}

		var result = [],
			re = /.+?[\]]+/g,
			match,
			i = 0;

		while ((match = re.exec(xpath)) !== null) {
			result[i] = (i == 0) ? match[0] : result[i - 1] + match[0];
			i++;
		}

		return result;
	};


	var _setConfig = function (config) {
		if (config !== undefined) {
			config.open = _parseOpenXpath(config.open);
			$.extend(Rvk.config, config);
		}

	};

	var _init = function (type) {
		config.root = $(config.root);
		config.breadcrumbroot = $(config.breadcrumbroot);

		if (type == 'slide') {
			Slide.init();
		} else {
			Tree.init();
		}

		Breadcrumb.init();
	};

	var Breadcrumb = (function () {

		var _parent, _prepend;

		var _init = function () {
			Rvk.config.breadcrumbroot.html('<span>alles unter: </span><div></div>');
		};

		var _getParent = function (id) {
			if (Rvk.config.breadcrumbroot.find('div[name="' + id + '"]').length) {
				_parent = Rvk.config.breadcrumbroot.find('div[name="' + id + '"]');
				_prepend = ' > ';
			} else {
				_parent = Rvk.config.breadcrumbroot;
				_prepend = '';
			}
		};

		var _add = function (a, parent_id, breadcrumbHandler) {
			_getParent(parent_id);

			var id = a.attr("rel");
			var notation = a.find('span[name="notation"]').text();
			var title = a.find('span[name="title"]').text();

			var breadcrumb = '<div class="rvk-breadcrumb" name="' + id + '" title="' + title + '"><span>' + _prepend + '</span><a href="#" rel="' + id + '">' + notation + '</a><div></div></div>';

			_parent.find("div").replaceWith(breadcrumb);

			_parent.find("div").find("a").bind('click', breadcrumbHandler);

			Rvk.active.id = id;
			Rvk.active.notation = notation;
		};

		var _remove = function (a) {
			_getParent(a.attr("rel"));
			_parent.html("");
			var last = _parent.parent().find('A');
			Rvk.active.id = last.attr('rel');
			Rvk.active.notation = last.text();
		};

		return {
			add: _add,
			remove: _remove,
			init: _init,
		};
	})();

	var Tree = (function () {

		var _init = function () {
			Rvk.config.root.html('<ul class="jqueryFileTree start"><li class="wait">' + Rvk.config.loadMessage + '<li></ul>');
			_addBranch(Rvk.config.root);
		};

		var _addBranch = function (parent_element, id) {
			Rvk.config.json.func(id, Rvk.config.json.url, Rvk.config.json.params, function (data) {
				$(parent_element).find('.start').html('');
				$(parent_element).removeClass('wait').append(data);

				_bindClickHandler(parent_element, id);

				$(parent_element).find('UL:hidden').slideDown({duration: Rvk.config.speed});

				$.each($(parent_element).find('LI A'), function (key, val) {
					var rel = $(val).attr("rel");

					if (-1 != $.inArray(rel, Rvk.config.open)) {
						$(val).trigger('click');
					}
					;
				});
			});
		};

		var _bindClickHandler = function (parent_element, parent_id) {
			$(parent_element).find('LI A').bind(Rvk.config.eventType, function () {

				var active = $(this).hasClass('active') ? true : false;

				if ($(this).parent().hasClass('directory')) {
					if ($(this).parent().hasClass('collapsed')) {
						// Expand
						// collapse all opened on the same level (recursivly)
						_closeOthers($(this).parent());
						// show the new branch
						_addBranch($(this).parent(), $(this).attr('rel'));

						$(this).parent().removeClass('collapsed').addClass('expanded');
					} else {
						// Collapse
						$(this).parent().find('UL').slideUp({duration: Rvk.config.speed});
						$(this).parent().removeClass('expanded').addClass('collapsed');
					}
				} else {
					// collapse all opened on the same level (recursivly)
					_closeOthers($(this).parent());
				}

				if (active) {
					$(this).removeClass('active');
					Breadcrumb.remove($(this));
				} else {
					$(this).addClass('active');
					var click = $(this);
					Breadcrumb.add($(this), parent_id, function () {
						click.trigger('click');
						return false;
					});
				}

				Rvk.config.eventHandler(Rvk.active);

				return false; // so the href is not followed
			});
			// Prevent A from triggering the # on non-click events
			if (Rvk.config.eventType.toLowerCase != Rvk.config.eventType) $(parent_element).find('LI A').bind(Rvk.config.eventType, function () {
				return false;
			});
		};

		var _closeOthers = function (li) {
			li.parent().find('UL').slideUp({duration: Rvk.config.collapseSpeed});

			// mark all directory elements as collapsed (recursivly)
			li.parent().find('LI.directory.expanded').removeClass('expanded').addClass('collapsed');

			// remove active class
			li.parent().find('A.active').removeClass('active');

			// remove all directory elements above
			li.find('UL').remove();
		};

		return {
			init: _init
		};
	})();

	var Slide = (function () {

		var _init = function () {
			// Loading message
			Rvk.config.root.html('<ul class="jqueryFileTree start"><li class="wait">' + Rvk.config.loadMessage + '<li></ul>')
			_replaceList(null);
		};

		var _replaceList = function (id, direction) {
			Rvk.config.json.func(id, Rvk.config.json.url, Rvk.config.json.params, function (data) {
				if (direction == undefined) {
					from = "right";
					to = "left";
				} else {
					from = "left";
					to = "right";
				}

				var ul = Rvk.config.root.find('ul');
				ul.hide('slide', {direction: from}, Rvk.config.speed, function () {
					Rvk.config.root.html(data);
					Rvk.config.root.find('ul:hidden').show('slide', {direction: to}, Rvk.config.speed);

					_bindClickHandler(id);

					$.each(Rvk.config.root.find('LI A'), function (key, val) {
						var rel = $(val).attr("rel");

						var i = $.inArray(rel, Rvk.config.open);
						if (-1 != i) {
							$(val).trigger(Rvk.config.eventType);
							Rvk.config.open.splice(i, 1);
						}
					})
				});

			})
		};

		var _bindClickHandler = function (parent_id) {
			Rvk.config.root.find('LI A').bind(Rvk.config.eventType, function () {
				if ($(this).parent().hasClass('directory')) {
					_replaceList($(this).attr('rel'));
				}

				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					Breadcrumb.remove($(this));
				} else {
					$(this).parent().parent().find('.active').removeClass('active');
					$(this).addClass('active');
					var click = $(this);
					Breadcrumb.add($(this), parent_id, function () {
						var events = click.data('events');

						Breadcrumb.remove($(this));

						if (events && events.click) {
							click.trigger('click');
						} else {
							_replaceList(parent_id, "back");
						}

						Rvk.config.eventHandler(Rvk.active);

						return false;
					});
				}

				Rvk.config.eventHandler(Rvk.active);

				return false; // so the href is not followed
			});

			// Prevent A from triggering the # on non-click events
			if (Rvk.config.eventType.toLowerCase != 'click') Rvk.config.root.find('LI A').bind('click', function () {
				return false;
			});
		};

		return {
			init: _init
		};
	})();

	return {
		setConfig: _setConfig,
		init: _init,
		config: config,
		active: active
	};
})(jQuery);

function rvk_init(id, url, params, process) {
	if (id !== null) {
		params.notation_id = id
	} else {
		params.notation_id = null
	}

	$.getJSON(url, params).done(function (data) {
		var items = [];
		var classes = "";

		$.each(data.data, function (key, val) {
			if (val.hasChildren > 0) {
				classes = "directory collapsed"
			} else {
				classes = "file ext_txt"
			}

			items.push('<li class="' + classes + '"><a href="#" rel="' + val.id + '"><span name="notation">' + val.notation + '</span> :: <span name="title">' + val.title + '</span></a></li>');
		});

		process('<ul class="jqueryFileTree" style="display:none">' + items.join('') + '</ul>', id)
	})
}
