import coWorkingSVG from '../../assets/svgs/co-working.svg'
const Default = (props) => {

    const setDashboardPath = props.setDashboardPath;
    // const dashboardPath = props.dashboardPath;
    const setReqRefNum = props.setReqRefNum;
    // const reqRefNum = props.reqRefNum;

    const handleReqRefNum = (e) => {
        setReqRefNum(e.target.value);
    }

    const handleSearch = () => {
        setDashboardPath('workspace/request_search_results');

    }
    return (
        <>
            <div className="tab">
                <p>Work Space</p>
                <img className='tab-icon' src={coWorkingSVG} alt='work space'/>
                <div className="tab-search-div">
                    <form action="" className='tab-search-form'>
                    <i class="bi bi-sort-alpha-down-alt"></i>
                        <input placeholder='Enter Request Reference #' type="text" onChange={handleReqRefNum} className="tab-search-input" />
                        <button className='tab-search-submit' onClick={handleSearch}> Search </button>
                    </form>
                </div>
                {/* <button onClick={handleSearch}> Search </button> */}
            </div>
            
        </> 
    );
}

export default Default;