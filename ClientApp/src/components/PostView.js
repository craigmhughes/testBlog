import React, { Component } from "react";


export default class PostView extends Component {
    static displayName = PostView.name;

    constructor(props) {
        super(props);
    }

    render() {

        // Redirect if no active viewed post.
        if (this.props.viewpost === null) {
            this.props.history.push('/');
            return null;
        }

        // Reformat date
        let date = this.props.viewpost.postedAt.split("T");
        date = date[0].split("-");
        date = `${date[2]}/${date[1]}/${date[0]}`;

        return (
            <main>
                <section className="mt-3">
                    <h1 className="display-3">{this.props.viewpost.title}</h1>
                    <p className="alert alert-light pl-0">{`Posted at: ${date} by `}<span class="badge badge-dark">{`${this.props.viewpost.author}`}</span></p>
                    <p className="h3">{this.props.viewpost.description}</p>
                    <hr class="my-4"/>
                </section>
                <section>
                    <p>{this.props.viewpost.body}</p>
                    <hr class="my-4 mt-3"/>
                    <p className="alert alert-light text-center pt-3">End of Post</p>
                </section>
            </main>
        );
    }
}