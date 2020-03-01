import React, { Component } from "react";
import authService from "./api-authorization/AuthorizeService";


export default class PostCreate extends Component {
    static displayName = PostCreate.name;

    constructor(props) {
        super(props);

        
        if (this.props.activePost) {
            this.state = {
                // Controlled input vals.
                postTitle: this.props.activePost.title,
                postAuthor: this.props.activePost.author,
                postDesc: this.props.activePost.description,
                postBody: this.props.activePost.body
            }
        } else {
            // Init empty state.
            this.state = {
            }
        }

    }

    /**
     * Set post attribute state for Controlled Input (Title)
     * @param {any} e = Event
     */
    setTitle(e) {
        this.setState({ postTitle: e.target.value });
    }

    /**
     * Set post attribute state for Controlled Input (Description)
     * @param {any} e = Event
     */
    setDesc(e) {
        this.setState({ postDesc: e.target.value });
    }

    /**
     * Set post attribute state for Controlled Input (Body)
     * @param {any} e = Event
     */
    setPostBody(e) {
        this.setState({ postBody: e.target.value });
    }

    /**
     *  On component mount, reset editing state on App to reenable "Create Post"
     *  view.
     * */
    async componentDidMount() {

        // Redirect if not logged in.
        if (await authService.isAuthenticated() === false) {
            this.props.history.push("/");
        }

        if (this.props.activePost) {
            this.props.setEditing(false);
        }
    }

    /**
     *  Create and send response based on activePost prop.
     * */
    async createPost() {
        const token = await authService.getAccessToken();
        const user = await authService.getUser();

        // Create Post object.
        let Post = {
            Title: this.state.postTitle,
            Author: user.name,
            Description: this.state.postDesc,
            Body: this.state.postBody
        };

        // Add Id to object if activePost exists.
        if (this.props.activePost) {
            Post["Id"] = this.props.activePost.id;
        }

        const response = await fetch(this.props.activePost ? `Posts/${this.props.activePost.id}` : "Posts", {
            method: this.props.activePost ? 'PUT' : 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Post),
        }).then(res => res.json());

        const data = await response;

        // Redirect on response.
        if (data.post) {
            this.props.history.push('/');
        }
    }

    /**
     *  Clears input values based on clear prop.
     * */
    componentDidUpdate() {
        if (this.props.clear) {
            this.setState({
                postTitle: "",
                postAuthor: "",
                postDesc: "",
                postBody: "",
            });

            this.props.setClear(false);
        }
    }

    render() {
        

        return (
            <main>
                <h1>{`${this.props.activePost ? "Edit Existing" : "Create New"} Post`}</h1>
                <form action={null} method={this.props.activePost ? "PUT" : "POST"} onSubmit={(e) => {
                    e.preventDefault();
                    this.createPost();
                }}>
                    <fieldset className="form-group">
                        <label htmlFor="Title">Title</label>
                        <input type="text" className="form-control" name="Title" ref={this.title}
                            
                            onChange={(e)=> this.setTitle(e)} value={this.state.postTitle}/>
                    </fieldset>

                    {this.props.activePost ? <input type="hidden" name="Id" value={this.props.activePost.id}/> : null}

                    <input type="hidden" name="Author" value={authService.getUser.name}/>

                    <fieldset className="form-group">
                            <label htmlFor="Description">Description</label>
                        <textarea type="text" className="form-control" name="Description" ref={this.description}
                            
                            onChange={(e) => this.setDesc(e)} value={this.state.postDesc}/>
                    </fieldset>

                    <fieldset className="form-group">
                        <label htmlFor="Body">Content</label>
                        <textarea type="text" className="form-control" name="Body" ref={this.postBody}
                            
                            onChange={(e) => this.setPostBody(e)} value={this.state.postBody}/>
                    </fieldset>

                    <button type="submit" className="btn btn-primary">Publish</button>
                </form>
            </main>
        );
    }
}