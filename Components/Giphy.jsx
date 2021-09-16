import { render } from '@testing-library/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import Paginate from './Paginate';

const Giphy = () => {
    // Gifs
    const [data, setData] = useState([]);
    // Search bar
    const [searchBar, setSearchBar] = useState("");
    // Loading new Gifs
    const [isLoading, setIsLoading] = useState(false);
    // Error identifier
    const [isError, setIsError] = useState(false);
    // State for each page (can be reuse)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // page 1 item 1- item 25
    // page 2 item 26- item 50
    // page 3 item 51- item 75

    useEffect(() => {
        // React Async is a promised-based library
        //  that makes it possible for you to
        //   fetch data in your React application
        const fetchDataOfApi = async () => {
            setIsError(false);
            setIsLoading(true);

            //While no error
            try {

                // Importing the API Key using axios

                // await is used to wait for the activity which here is a promise
                //  of fetching data from remote server.
                //  So it seems as if the function execution stops
                //   here and waits
                //   for the promise fulfilled before continuing with the
                //    execution
                const resultsApi = await axios("https://api.giphy.com/v1/gifs/trending", {
                    params: {
                        api_key: "izCDlq7OQ3Rfwm4ZOTFlMm7rmoy7Q5Cs",
                        limit: 100

                    }

                });
                console.log(resultsApi);
                setData(resultsApi.data.data);

                // iF "catch" error it will console logging 
                // the error
            } catch (err) {
                setIsError(true);

                // The warning alert wil appear for 4sec
                // if the error will set to true
                setTimeout(() => setIsError(false), 4000)
            }

            // Loading will be false
            //  and then will render the gifs
            setIsLoading(false)

        }
        //Calling out the function
        fetchDataOfApi()
    }, []);


    // Gif render function
    const renderGifs = () => {
        // When true = LOADING sign will show up
        if (isLoading) {
            return <div>
                <Loader />
            </div>
        }
        // When false = Gifs wil show up
        return currentItems.map(el => {
            return (
                <div key={el.id} className="gif">
                    <img src={el.images.fixed_height.url} />
                </div>
            )
        })
    };

    // Gif render Error
    const renderError = () => {
        if (isError) {
            return (
                <div className="alert alert-danger 
                alert-dismissible fade show" role="alert">
                    Oh no! Unable to get Gifs <br></br>
                    Please try again in a few minutes...
                </div>
            )
        }
    }

    // Search bar function
    const handleSearchChange = (event) => {
        setSearchBar(event.target.value);
    };


    const handleSubmit = async event => {

        event.preventDefault();
        setIsError(false);
        setIsLoading(true);

        try {
            const resultsApi = await
                axios("https://api.giphy.com/v1/gifs/search	", {
                    params: {
                        api_key: "izCDlq7OQ3Rfwm4ZOTFlMm7rmoy7Q5Cs",
                        q: searchBar,
                        limit: 100
                    }
                });

            setData(resultsApi.data.data);

        } catch (err) {
            setIsError(true);
            setTimeout(() => setIsError(false), 4000)
        }

        setIsLoading(false);

    };

    const pageSelected = (pageNumber) => {
        setCurrentPage(pageNumber);
    }


    // Return in index

    return (
        <div className="m-5">
            {renderError()}
            <form
                className="form-inline justify-content-center m-2"
            > <Paginate
                    pageSelected={pageSelected}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={data.length}
                />
                <input
                    onChange={handleSearchChange}
                    value={searchBar}
                    type="text"
                    placeholder="Search for a Gif"
                    className="form control"
                />
                <button onClick={handleSubmit}
                    type="submit"
                    className="btn btn-primary mx-3">Search</button>
            </form>
            <div className="container gifs">
                {renderGifs()}
            </div>
        </div>
    )
}

export default Giphy;