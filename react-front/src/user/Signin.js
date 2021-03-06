import React, { Component } from 'react'
import { signin, authenticate } from '../auth';
import { Link, Redirect } from "react-router-dom";
import SocialLogin from "./SocialLogin";

class Signin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = val => event => {
        this.setState({ error: "" });
        this.setState({ [val]: event.target.value })
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = {
            email,
            password,
        };
        signin(user)
            .then(data => {
                if (data.error) this.setState({ error: data.error, loading: false })
                else {
                    //authenticate user
                    authenticate(data, () => {
                        //redirect
                        this.setState({ redirectToReferer: true })
                    })
                }
            });
    };


    SigninForm = (email, password) => (

        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >Submit</button>
        </form>
    );


    render() {
        const { email, password, error, redirectToReferer, loading } = this.state;

        if (redirectToReferer) {
            return <Redirect to="/" />
        };

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Sign In</h2>

                <hr />
                <SocialLogin />
                <hr />

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading
                    ? <div className="jumbotron text-center"><h2>Loading...</h2></div>
                    : ""
                }

                {this.SigninForm(email, password)}

                <p>
                    <Link to="/forgot-password" className="text-danger">
                        {" "}
                Forgot Password
                </Link>
                </p>

            </div>
        )
    }
}

export default Signin;
