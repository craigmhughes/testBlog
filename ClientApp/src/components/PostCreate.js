import React, { Component } from "react";
import authService from "./api-authorization/AuthorizeService";


export default class PostCreate extends Component {
    static displayName = PostCreate.name;

    constructor(props) {
        super(props);

        this.title = React.createRef();
        this.description = React.createRef();
        this.postBody = React.createRef();
    }

    async createPost() {
        const token = await authService.getAccessToken();
        const user = await authService.getUser();

        let Post = {
            Title: this.title.current.value,
            Author: user.name,
            Description: this.description.current.value,
            Body: this.postBody.current.value
        };

        const response = await fetch("Posts", {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Post),
        }).then(res => res.json());

        const data = await response;
        console.log(data);
    }

    render() {
        return (
            <main>
                <h1>Create New Post</h1>
                <form action={null} method="POST" onSubmit={(e) => {
                    e.preventDefault();
                    this.createPost();
                }}>
                    <fieldset className="form-group">
                        <label htmlFor="Title">Title</label>
                        <input type="text" className="form-control" name="Title" ref={this.title}/>
                    </fieldset>

                    <input type="hidden" name="Author" value={authService.getUser.name}/>

                    <fieldset className="form-group">
                            <label htmlFor="Description">Description</label>
                        <textarea type="text" className="form-control" name="Description" ref={this.description}/>
                    </fieldset>

                    <fieldset className="form-group">
                        <label htmlFor="Body">Content</label>
                        <textarea type="text" className="form-control" name="Body" ref={this.postBody} />
                    </fieldset>

                    <button type="submit" className="btn btn-primary">Publish</button>
                </form>
            </main>
        );
    }
}