import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Grid, Button, Divider} from 'semantic-ui-react';
import ReactPaginate from 'react-paginate';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            page: 2,
            loadJobs: [],
            cardData:[],
            loaderData: loader,
            activePage: '',
            offset: 0,
            perPage:2,
            currentPage:0,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            activeIndex: "",
            message1: ""

        } 
        this.handlePageClick=this.handlePageClick.bind(this);
        //  this.handleClick= this.handleClick.bind(this);  
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here

    };

    // handlePageChange({e, activePage }) {
    //      this.setState({ activePage }) 
    //      var selectedPage=e.selected;
    //      var offset=selectedPage*this.state.perPage;

    //               this.setState({
    //               currentPage:selectedPage,
    //               offset:offset
    //               },  ()=>{
    //                   this.loadMoreData()
    //               });
    //     }


    //handlePageClick=(event)=>{
    //          var selectedPage = event.selected;
    //              var offset=selectedPage*this.state.perPage;

    //              this.setState({
    //              currentPage:selectedPage,
    //              offset:offset
    //              });
    //    }
                handlePageClick(e) {
                var selectedPage=e.selected;
                var offset=selectedPage*this.state.perPage;
            
                this.setState({
                currentPage:selectedPage,
                offset:offset
                },  ()=>{
                    this.loadMoreData()
                });
            }

            loadMoreData() {

                var data=this.state.loadJobs;

                var slice=data.slice(this.state.offset,this.state.offset + this.state.perPage)
                
                this.setState({
                pageCount:Math.ceil(data.length/this.state.perPage),
                cardData:slice
                })

        }


    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData() {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                activePage: 1,
                sortbyDate: "desc",
                showActive:true,
                showClosed:true,
                showDraft:true,
                showExpired:true,
                showUnexpired:true
            },
            success: function (res) {
                if (res.success == true) {
                    this.setState({ loadJobs: res.myJobs})
                    this.setState({ mycount: res.totalCount})

                    var data=res.myJobs;

                    var slice=data.slice(this.state.offset,this.state.offset + this.state.perPage)
                   
                    this.setState({
          
                      pageCount:Math.ceil(data.length/this.state.perPage),
                      loadJobs:res.myJobs,
                      cardData:slice
                    
                    })

                } 
                else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
                if(this.state.mycount=='0')
                {
                    this.setState({message1:"No Jobs found"})
                }
            }.bind(this)
        })
      
        // your ajax call and other logic goes here
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        const {activePage} = this.state
        const {loadJobs}=this.state;

        const ShowOptions=[
            {key:1,text:'showClosed',value:'showClosed'},
            {key:2,text:'showDraft', value:'showDraft'},
            {key:3,text:'showExpired',value:'showExpired'},
            {key:4,text:'showUnexpired',value:'showUnexpired'}
        ]
        const SortOptions=[
            {key:1,text:'Newest First',value:'Newest First'},
            {key:2,text:'Oldest First', value:'Oldest First'},
        ]
    
        console.log(this.state.mycount);
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">
              <h1>List of Jobs</h1>
              <span>
            <Icon name='filter' /> 
           <b>Filter:</b> 
            </span>

              <Dropdown
                floating
                placeholder= 'Choose filter'
                options={ShowOptions}
                className='icon'/>
                <span>
                <Icon name='calendar' /> 
                <b>Sort by date:</b>
                </span>
                <Dropdown
                placeholder= 'Newest First'
                options={SortOptions}
                className='icon'/>
                <br/><br/> 
                <h3>
                {this.state.message1}
                </h3>
                        <Grid column={3}>
                            <Grid.Row >
                            {this.state.cardData.map((MJob) => {
                                    return (
                                        <Grid.Column style={{ width: "50%", borderRadius: "0" }} >
                                            <div className='ui segment'>
                                                <div className='ui grid'>
                                                    <div className='ui row'>
                                                        <div className='ui sixteen column wide'>
                                                            <div>
                                                                <h3>{MJob.title}</h3>
                                                                <a class="ui black right ribbon label"><Icon name='user'/>0</a>
                                                                <p>{MJob.location.city}</p>
                                                                <p className="description job-summary">{MJob.summary}</p>
                                                            </div>
                                                            <Divider clearing></Divider>
                                                            <div>
                                                                <Button color='red'>Expired</Button>
                                                                <Button.Group  className='Bright'>
                                                                    <Button basic color='blue'><Icon name='close'/>Close</Button>
                                                                    <Button basic color='blue'><Icon name='edit'/>Edit</Button>
                                                                    <Button basic color='blue'><Icon name='copy'/>Copy</Button>
                                                                </Button.Group>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    )
                                })
                                }
                            </Grid.Row><br /><br />
                        </Grid>
                <br/>
                <br/><br/>
               <div className='Pcenter'>
                <ReactPaginate
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
                </div>
                </div>
                <br/>
                <br/>
            </BodyWrapper>
            
        )
    }
}
