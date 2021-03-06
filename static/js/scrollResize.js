/*!
   Copyright 2015 SpryMedia Ltd.

 License      MIT - http://datatables.net/license/mit

 This feature plug-in for DataTables will automatically change the DataTables
 page length in order to fit inside its container. This can be particularly
 useful for control panels and other interfaces which resize dynamically with
 the user's browser window instead of scrolling.

 Page resizing in DataTables can be enabled by using any one of the following
 options:

 * Setting the `scrollResize` parameter in the DataTables initialisation to
   be true - i.e. `scrollResize: true`
 * Setting the `scrollResize` parameter to be true in the DataTables
   defaults (thus causing all tables to have this feature) - i.e.
   `$.fn.dataTable.defaults.scrollResize = true`.
 * Creating a new instance: `new $.fn.dataTable.ScrollResize( table );` where
   `table` is a DataTable's API instance.
 ScrollResize for DataTables v1.0.0
 2015 SpryMedia Ltd - datatables.net/license
*/
(function (a) {
  "function" === typeof define && define.amd
    ? define(["jquery", "datatables.net"], function (b) {
        return a(b, window, document);
      })
    : "object" === typeof exports
    ? (module.exports = function (b, d) {
        b || (b = window);
        (d && d.fn.dataTable) || (d = require("datatables.net")(b, d).$);
        return a(d, b, b.document);
      })
    : a(jQuery, window, document);
})(function (a, b, d, k) {
  var g = function (e) {
    var f = this,
      c = e.table();
    this.s = {
      dt: e,
      host: a(c.container()).parent(),
      header: a(c.header()),
      footer: a(c.footer()),
      body: a(c.body()),
      container: a(c.container()),
      table: a(c.node()),
    };
    c = this.s.host;
    "static" === c.css("position") && c.css("position", "relative");
    e.on("draw", function () {
      f._size();
    });
    this._attach();
    this._size();
  };
  g.prototype = {
    _size: function () {
      var e = this.s,
        f = e.dt,
        c = f.table(),
        b = a(e.table).offset().top,
        h = e.host.height(),
        d = a("div.dataTables_scrollBody", c.container());
      h = h - b - (e.container.height() - (b + d.height()));
      a("div.dataTables_scrollBody", c.container()).css({
        maxHeight: h,
        height: h,
      });
      f.fixedColumns && f.fixedColumns().relayout();
    },
    _attach: function () {
      var e = this,
        b = a("<iframe/>")
          .css({
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: -1,
            border: 0,
          })
          .attr("frameBorder", "0")
          .attr("src", "about:blank");
      b[0].onload = function () {
        var a = this.contentDocument.body,
          b = a.offsetHeight,
          d = this.contentDocument;
        (d.defaultView || d.parentWindow).onresize = function () {
          var c = a.clientHeight || a.offsetHeight,
            f = d.documentElement.clientHeight;
          !c && f && (c = f);
          c !== b && ((b = c), e._size());
        };
      };
      b.appendTo(this.s.host).attr("data", "about:blank");
    },
  };
  a.fn.dataTable.ScrollResize = g;
  a.fn.DataTable.ScrollResize = g;
  a(d).on("init.dt", function (b, d) {
    "dt" === b.namespace &&
      ((b = new a.fn.dataTable.Api(d)),
      (d.oInit.scrollResize || a.fn.dataTable.defaults.scrollResize) &&
        new g(b));
  });
});
