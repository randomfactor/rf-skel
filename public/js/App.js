/**
 * Created by randall on 7/4/15.
 */

var Navbar = React.createClass({displayName: "Navbar",
    handleLogin: function(e) {
        this.props.onLogin(e);
    },
    handleLogout: function(e) {
        this.props.onLogout(e);
    },
    render: function() {
        var signInStatus = React.createElement("button", {type: "button", className: "btn btn-success", onClick: this.handleLogin}, "Sign in");
        if (this.props.username != undefined) {
            signInStatus = React.createElement("span", null, React.createElement("span", {className: "form-control"}, "Welcome, ", this.props.username, "!"), 
                React.createElement("button", {type: "button", className: "btn btn-success", onClick: this.handleLogout}, "Sign out"));
        }
        return (
            React.createElement("nav", {className: "navbar navbar-default navbar-static-top"}, 
                React.createElement("div", {className: "container"}, 
                    React.createElement("div", {className: "navbar-header"}, 
                        React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar", "aria-expanded": "false", "aria-controls": "navbar"}, 
                            React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
                            React.createElement("span", {className: "icon-bar"}), 
                            React.createElement("span", {className: "icon-bar"}), 
                            React.createElement("span", {className: "icon-bar"})
                        ), 
                        React.createElement("a", {className: "navbar-brand", href: "#"}, this.props.project)
                    ), 
                    React.createElement("div", {id: "navbar", className: "navbar-collapse collapse"}, 
                        React.createElement("ul", {className: "nav navbar-nav"}, 
                            React.createElement("li", {className: "active"}, React.createElement("a", {href: "#"}, "Home")), 
                            React.createElement("li", null, React.createElement("a", {href: "#about"}, "About")), 
                            React.createElement("li", null, React.createElement("a", {href: "#rooms"}, "Rooms")), 
                            React.createElement("li", {className: "dropdown"}, 
                                React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown", role: "button", "aria-haspopup": "true", "aria-expanded": "false"}, 
                                    "Dropdown ", React.createElement("span", {className: "caret"})
                                ), 
                                React.createElement("ul", {className: "dropdown-menu"}, 
                                    React.createElement("li", null, React.createElement("a", {href: "#"}, "Action")), 
                                    React.createElement("li", null, React.createElement("a", {href: "#"}, "Another action")), 
                                    React.createElement("li", null, React.createElement("a", {href: "#"}, "Something else here")), 
                                    React.createElement("li", {role: "separator", className: "divider"}), 
                                    React.createElement("li", {className: "dropdown-header"}, "Nav header"), 
                                    React.createElement("li", null, React.createElement("a", {href: "#"}, "Separated link")), 
                                    React.createElement("li", null, React.createElement("a", {href: "#"}, "One more separated link"))
                                )
                            ), 
                            React.createElement("li", null, React.createElement("a", {href: "#practice"}, "Practice"))
                        ), 
                        React.createElement("ul", {className: "nav navbar-nav navbar-right navbar-form"}, 
                            React.createElement("li", {className: "active"}, signInStatus)
                        )
                    )
                )
            )
        )
    }
});

// fake a user for now
var user1 = {
    name: 'Randall',
    roles: [ 'admin', 'player' ],
    id: '12341234-1234-123412341234',
    email: 'randall.krebs@krebsweb.com'
}

var App = React.createClass({displayName: "App",
    getInitialState: function() {
        return {};
    },
    handleSignin: function(e) {
        e.preventDefault();
        navigator.id.request();
    },
    handleSignout: function(e) {
        e.preventDefault();
        navigator.id.logout();
        this.setState({user: undefined});
    },
    serverLogin: function(assertion) {
        return $.post('/auth/browserid', {
            assertion: assertion
        }).then((function(_this) {
            return function(data, textStatus, jqXHR) {
                var ref;
                if (data != null ? (ref = data.user) != null ? ref._id : void 0 : void 0) {
                    console.log("current user id: " + data.user._id);
                    return _this.setState({user: data.user});
                } else {
                    _this.setState({user: undefined});
                    return alert('Login failed. Try again later, maybe?');
                }
            };
        })(this), (function(_this) {
            return function(jqXHR, textStatus, errorThrown) {
                alert("Login failure: " + textStatus);
                return navigator.id.logout();
            };
        })(this));
    },
    serverLogout: function() {
        return $.get('/logout').then((function(_this) {
            return function(data, textStatus, jqXHR) {
                _this.setState({user: undefined});
                return console.log("current user: null");
            };
        })(this), (function(_this) {
            return function(jqXHR, textStatus, errorThrown) {
                return alert("Logout failure: " + textStatus);
            };
        })(this));
    },
    componentDidMount: function() {
        navigator.id.watch({
                loggedInUser: null,
                onlogin: function(assertion) {
                    alert(assertion);
                    this.serverLogin(assertion);
                }.bind(this),
                onlogout: function() {
                    this.setState({user: undefined});
                    this.serverLogout();
                }.bind(this)
            }
        );
    },
    render: function() {
        var ref, ref1;
        var username = (ref = this.state) != null ? (ref1 = ref.user) != null ? ref1.name : void 0 : void 0;
        return (
            React.createElement("div", {id: "content"}, 
                React.createElement(Navbar, {project: "RF Skeleton", username: username, onLogin: this.handleSignin, onLogout: this.handleSignout}), 
                React.createElement("div", {className: "commentBox"}, 
                    "Hello, world! I am a CommentBox."
                )
            )
        );
    }
});
//# sourceMappingURL=App.js.map