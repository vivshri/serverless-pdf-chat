import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import trailImage from './trail.png';


const RecognizedPortal = () => {
  // State to store API call details
  const [apiCallDetails, setApiCallDetails] = useState({
    urlPath: "",
    requestBody: "",
    responseContent: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    console.log("Updated apiCallDetails.responseContent:", apiCallDetails.responseContent);
  }, [apiCallDetails.responseContent]); // Depend on apiCallDetails.responseContent

  const submitMessage = async () => {
    console.log("Calling Submit Messsage");
    const apiUrlPath = `/8mqCtTAehxVbbQTBautv9d/HdbkvhwustAzKr7jh2rcVN`;
    const requestBody = {
      body: {
        fileName: "Vivek-Accoldes-5WV4.pdf",
        prompt: "Describe vivek",
      },
    };

    try {
      const response = await API.post(
        "serverless-pdf-chat",
        apiUrlPath,
        requestBody
      );

      setApiCallDetails((prevState) => ({
        ...prevState,
        urlPath: apiUrlPath,
        requestBody: JSON.stringify(requestBody, null, 2),
        responseContent: JSON.stringify(response, null, 2), // Store the API response
      }));
      console.log("vivek apiCallDetails.responseContent" + apiCallDetails.responseContent);
    } catch (error) {
      console.error("API call failed:", error);
      setApiCallDetails((prevState) => ({
        ...prevState,
        responseContent: `Error: ${error}`, // Store error message if the API call fails
      }));
    }

    

    // Other post-API call actions
    // setPrompt("");
    // fetchData(conversation?.conversationid);
    // setMessageStatus("idle");
  };

  // @ts-ignore
  const formatResponseContent = (responseContent) => {
    // Split the response content by "\n\n" to preserve paragraphs
    // @ts-ignore
    const paragraphs = responseContent.split('\n\n');
    
    // Map each paragraph to a span element, replacing single "\n" with <br />, and join paragraphs with an additional <br /> to preserve double newlines
    // @ts-ignore
    return paragraphs.map((paragraph, index) => (
      <span key={index}>
        {// @ts-ignore
        paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            <br />
          </React.Fragment>
        ))}
        {index < paragraphs.length - 1 ? <br /> : null}
      </span>
    ));
  };
  // @ts-ignore
  const createMarkup = (responseContent) => {
    // Replace newline characters with <br/> tags
    const htmlContent = responseContent.replace('/\n', '<br/>');
    return { __html: htmlContent };
  };
  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true before API call
    await submitMessage();
    setIsLoading(false); // Set loading to false after API call
  };



//   return (
//     <div
//       className="container p-8"
//       style={{
//         minHeight: "100vh",
//         backgroundImage: `url(${trailImage})`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundAttachment: "fixed",
//         backgroundPosition: "center",
//       }}
//     >
//       <h1 className="text-3xl font-bold text-center uppercase my-5">Trail</h1>
//       <div className="flex justify-center">
//         <div className="w-full max-w-4xl">
//           <div className="flex items-center justify-center mt-6"></div>
//           <form>
//             {/* <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             /> */}

//             <button type="submit">Search</button>
//             <input
//               type="search"
//               placeholder="Search By User Alias"
//               className="p-2 border rounded w-1/2"
//               //   type="text"
//               //   value={searchTerm}
//               //   onChange={handleSearchChange}
//             />
//             <div>
//               API Response: <pre>{apiCallDetails.responseContent}</pre>
//             </div>
//             <button
//               type="submit"
//               className="p-2 ml-4 bg-blue-500 text-white rounded"
//               onClick={handleSubmit}
//             >
//               Search
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );

return (
    <div
      className="container p-8"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${trailImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-3xl font-bold text-center uppercase my-5">Trail</h1>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-center mt-6"></div>
          <input
              type="search"
              placeholder="Search By User Alias"
              className="p-2 border rounded w-1/2"
              //   type="text"
              //   value={searchTerm}
              //   onChange={handleSearchChange}
            />
          <form onSubmit={handleSubmit}>
            {/* Omitted input for brevity */}
            <button
              type="button"
              className="p-2 ml-4 bg-blue-500 text-white rounded"
              onClick={handleSubmit}
            >
              Search
            </button>
            <div className="mt-4 p-4 bg-white rounded shadow">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div 
                    style={{
                        maxHeight: "300px", // Limit the height of the container
                        overflowY: "auto",  // Enable vertical scrolling for overflow content
                        whiteSpace: "pre-wrap", // Wrap the content within the pre tag
                        wordWrap: "break-word", // Break words that exceed the width of the container
                        border: "1px solid #ccc", // Optional: add a border for visual clarity
                        padding: "10px", // Optional: add some padding for aesthetics
                        backgroundColor: "#f9f9f9", // Optional: change the background color for contrast
                        borderRadius: "5px" // Optional: round the corners of the container
                    }}
                    >
                    {apiCallDetails.responseContent}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default RecognizedPortal;
