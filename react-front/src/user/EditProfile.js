import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultAvatar from '../images/avatar.png';

class EditProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            loading: false,
            fileSize: 0,
            about: ""
        }
    };

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        about: data.about
                        // error: ""
                    });
                }
            });
    };

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    };

    isValid = () => {
        const { name, email, fileSize } = this.state;

        if (fileSize > 500000) {
            this.setState({ error: 'File size should be less than 500kb', loading: false })
            return false;
        }

        if (name.length === 0) {
            this.setState({ error: 'Name is required', loading: false })
            return false;
        }

        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            this.setState({ error: 'Email is not valid', loading: false })
            return false;
        }

        return true;
    }


    handleChange = val => event => {
        this.setState({ error: "" });
        const value = val === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = val === 'photo' ? event.target.files[0].size : 0;
        this.userData.set(val, value);
        this.setState({ [val]: value, fileSize })
    };


    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {

            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;

            update(userId, token, this.userData)
                .then(
                    data => {
                        if (data.error) {
                            this.setState({ error: data.error })
                        } else {
                            updateUser(data, () => {
                                this.setState({
                                    redirectToProfile: true
                                });
                            });
                        }
                    }
                );
        }
    };

    signupForm = (name, email, password, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
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
                <label className="text-muted">About</label>
                <textarea
                    onChange={this.handleChange("about")}
                    type="text"
                    className="form-control"
                    value={about}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update</button>
        </form>
    );


    render() {
        const { id, name, email, password, redirectToProfile, error, loading, about } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        const photoUrl = id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}`
            : DefaultAvatar

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Edit Profile</h2>

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

                <img
                    className='img-thumbnail'
                    style={{ height: '200px', width: 'auto' }}
                    src={photoUrl}
                    alt={name}
                />

                {this.signupForm(name, email, password, about)}
            </div>
        )
    }
};

export default EditProfile;
