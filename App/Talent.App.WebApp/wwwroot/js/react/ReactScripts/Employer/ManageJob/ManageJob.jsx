import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Grid,Button,Divider} from 'semantic-ui-react';


export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
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
            totalPages: 1,
            activeIndex: ""
        } 
        // this.handlePageClick= this.handlePageClick.bind(this);  
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here

    };

        // handlePageClick=(e)=> {
        //         var selectedPage=e.selected;
        //         var offset=selectedPage*this.state.perPage;
            
        //         this.setState({
        //         currentPage:selectedPage,
        //         offset:offset
        //         },  ()=>{
        //             this.loadMoreData()
        //         });
        //     }

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

                            <Grid column={3}>
                                <Grid.Row >
                                {this.state.loadJobs.map((MJob) => {
                                    return (
                                    <Grid.Column className='jobcolumn' >
                                            <div className='ui segment'>
                                                <div className='ui grid'>
                                                    <div className='ui row'>
                                                        <div className='ui sixteen column wide'>
                                                                <div>
                                                                    <h3>{MJob.title}</h3>
                                                                    <p>{MJob.location.city}</p>
                                                                    <p className="description job-summary">{MJob.summary}</p>
                                                                </div>
                                                                <Divider clearing></Divider>
                                                                <div>
                                                                    <Button color='red'>Expired</Button>
                                                                    <Button.Group>
                                                                        <Button basic color='blue'>Close</Button>
                                                                        <Button basic color='blue'>Edit</Button>
                                                                        <Button basic color='blue'>Copy</Button>
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
                                </Grid.Row>
                            </Grid>

                <br/>
                <br/><br/>
               </div>
               <Pagination defaultActivePage={3} totalPages={5} />
            </BodyWrapper>
            
        )
    }
}