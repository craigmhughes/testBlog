import React, { Component } from 'react';
import { Route, withRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css';
import PostCreate from './components/PostCreate';
import PostView from './components/PostView';

class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            activePost: null,
            editing: false,
            clearField: false,
            viewpost: null
        };

        this.setActivePost = this.setActivePost.bind(this);
        this.setEditing = this.setEditing.bind(this);
        this.setClear = this.setClear.bind(this);
        this.setViewpost = this.setViewpost.bind(this);
    }

    setActivePost(post) {
        this.setState({
            activePost: post,
            editing: post !== null,
            clearField: post === null
        });
    }

    setViewpost(post) {
        this.setState({
            viewpost: post,
        });

        this.props.history.push('/Post/View');
    }

    setEditing(edit) {
        this.setState({
            editing: edit
        });
    }

    setClear(clear) {
        this.setState({
            clearField: clear
        });
    }

    render() {

        return (
            // Layout passes props to Nav to allow "Create Post" link to disable editing state.
            <Layout activePost={this.state.activePost} setActivePost={this.setActivePost}>
                <Route exact path='/' render={(props) => <Home setActivePost={this.setActivePost}
                    activePost={this.state.activePost} history={props.history} editing={this.state.editing}
                    setViewpost={this.setViewpost}/>} />

                <Route exact path='/Post/New' render={(props) => <PostCreate activePost={this.state.activePost}
                    setEditing={this.setEditing} history={props.history} clear={this.state.clearField}
                    setClear={this.setClear}
                    setActivePost={this.setActivePost} />} />

                <Route exact path='/Post/View' render={(props) => <PostView viewpost={this.state.viewpost} history={props.history} />} />

              <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
          </Layout>
        );
  }
}

export default withRouter(App);
