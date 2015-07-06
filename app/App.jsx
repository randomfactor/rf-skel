/**
 * Created by randall on 7/4/15.
 */

var Navbar = React.createClass({
    handleLogin: function(e) {
        this.props.onLogin(e);
    },
    handleLogout: function(e) {
        this.props.onLogout(e);
    },
    render: function() {
        var signInStatus = <button type="button" className="btn btn-success" onClick={this.handleLogin}>Sign in</button>;
        if (this.props.username != undefined) {
            signInStatus = <span><span className="form-control">Welcome, {this.props.username}!</span>
                <button type="button" className="btn btn-success" onClick={this.handleLogout}>Sign out</button></span>;
        }
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">{this.props.project}</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="#">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#rooms">Rooms</a></li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                    Dropdown <span className="caret"></span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a href="#">Action</a></li>
                                    <li><a href="#">Another action</a></li>
                                    <li><a href="#">Something else here</a></li>
                                    <li role="separator" className="divider"></li>
                                    <li className="dropdown-header">Nav header</li>
                                    <li><a href="#">Separated link</a></li>
                                    <li><a href="#">One more separated link</a></li>
                                </ul>
                            </li>
                            <li><a href="#practice">Practice</a></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right navbar-form">
                            <li className="active">{signInStatus}</li>
                        </ul>
                    </div>
                </div>
            </nav>
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

var App = React.createClass({
    getInitialState: function() {
        //return {user: user1};
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
    componentDidMount: function() {
        navigator.id.watch({
                loggedInUser: null,
                onlogin: function(assertion) {
                    alert(assertion);
                    this.setState({user: user1});
                }.bind(this),
                onlogout: function() {
                    this.setState({user: undefined});
                }.bind(this)
            }
        );
    },
    render: function() {
        var ref, ref1;
        var username = (ref = this.state) != null ? (ref1 = ref.user) != null ? ref1.name : void 0 : void 0;
        return (
            <div id="content">
                <Navbar project="RF Skeleton" username={username} onLogin={this.handleSignin} onLogout={this.handleSignout}/>
                <div className="commentBox">
                    Hello, world! I am a CommentBox.
                </div>
            </div>
        );
    }
});