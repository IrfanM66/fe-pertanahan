import { Oval } from "react-loader-spinner";

const Spinner = () => {
  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  };


  return (
    <tr>
        <div style={wrapperStyle}>
          <Oval
            visible={true}
            height="50"
            width="50"
            color="#3B6F9E"
            secondaryColor="#9CA3AF"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
    </tr>
  );
};

export default Spinner;
