import APIKeyForm from "./APIKeyForm";

const Popup = () => {
  return (
    <div className="container" style={{
      width: "425px",
      padding: "20px",
      paddingTop: "15px",
    }}>
      <div style={{ textAlign: "center"}}>
        <h1>TextToolkitAI</h1>
        <p>Here you can configure the extension.</p>
      </div>

      <APIKeyForm />
    </div>
  );
};

export default Popup;