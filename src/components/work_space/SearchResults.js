const SearchResults = (props) => {
    const reqRefNum = props.reqRefNum;

    return (
        <>
            <div className="tab">
                <h3>Request Found</h3>
                <div className="tab-search-div">
                    <h3>Reference #:{reqRefNum}</h3>
                    <h3>Status:</h3>
                        <button className='sv-btn'>Save</button>
                        <button className='del-btn'>Delete</button>
                        <button className='upd-btn'>Edit</button>
                    <h3>Created by:</h3>
                    <h3>Created at:</h3>
                    <h3>Brought by:</h3>
                </div>
                
            </div>
        </>
    );
}
export default SearchResults;