import React, { Component } from "react";
import { Card, CardImg, CardText, CardBody ,Breadcrumb , BreadcrumbItem, Button, Modal, ModalHeader, ModalBody,
            Row, Label, Col} from 'reactstrap';
import { Control, LocalForm , Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state ={
            isModalOpen : false,
            rating: 1,
            author:'',
            text:'',
            touched:{
                author: false
            }
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    } 

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    render(){
        return(
            <React.Fragment>
            <Button outline onClick={this.toggleModal}>
                 <i className="fa fa-pencil fa-lg" />Submit Comment 
            </Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={12}> Rating </Label>
                                <Col md={12}>
                                    <Control.select 
                                            model=".rating"
                                            className="form-control">
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}> Your Name </Label>
                                <Col md={12}>
                                    <Control.text 
                                        model=".author"
                                        className="form-control" 
                                        id ="author" 
                                        name="author"
                                        validators={{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}>
                                    </Control.text>
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                       />
                                </Col>
                                
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="text" md={12}> Comments </Label>
                                <Col md={12}>
                                    <Control.textarea 
                                            model=".text"
                                            className="form-control" 
                                            id="text" 
                                            name="text" 
                                            row="6">
                                    </Control.textarea>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={10}>
                                    <Button type="submit" color="primary">
                                       Submit
                                    </Button>
                                </Col>
                            </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
            </React.Fragment>
        );
    }
}
function RenderCampsite({campsite}){
        return(
            <div className="col-md-5 m-1">
                 <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                    <Card>
                        <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                        <CardBody>
                            <CardText>{campsite.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        );
    }

function RenderComments({comments,postComment, campsiteId}){
        if(comments){
            return(
                <div className="col-md-5 m-1">
                    <h4>Comments</h4><Stagger in>
                        {comments.map(n => <Fade in key={n.id}><div> <p> <div>{n.text}</div> <div>--- {n.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(n.date)))}</div> </p> </div></Fade>)}
                        </Stagger><CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
            );
        }else{
            return(<div></div>);
        }
}


function CampsiteInfo(props){
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }

        if(props.campsite){
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                 <BreadcrumbItem active> {props.campsite.name} </BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite}/>
                        <RenderComments 
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                     </div> 
                </div>
            );
        }else{
            return <div></div> ;
        }
    }

export default CampsiteInfo;