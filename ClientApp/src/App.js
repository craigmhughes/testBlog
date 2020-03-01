import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'
import PostCreate from './components/PostCreate';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            activePost: null,
            editing: false,
            clearField: false
        };

        this.setActivePost = this.setActivePost.bind(this);
        this.setEditing = this.setEditing.bind(this);
        this.setClear = this.setClear.bind(this);
    }

    setActivePost(post) {
        this.setState({
            activePost: post,
            editing: post !== null,
            clearField: post === null
        });
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
                    activePost={this.state.activePost} history={props.history} editing={this.state.editing}/>} />
                <Route exact path='/Posts/New' render={(props) => <PostCreate activePost={this.state.activePost}
                    setEditing={this.setEditing} history={props.history} clear={this.state.clearField}
                    setClear={this.setClear}
                    setActivePost={this.setActivePost}/>} />

              <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
          </Layout>
        );
  }
}
