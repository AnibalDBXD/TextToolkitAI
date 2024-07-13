import { useState } from "react";
import { setGroqApiKey } from "../apikey-state";

const APIKeyForm = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(">>> handleSubmit", event);
    const groqApiKey = ((event.target as HTMLFormElement)[1] as HTMLInputElement).value
    const groqApiKey2 = (event.target as HTMLFormElement)["groq-api-key"].value
    console.log(">>> groqApiKey", groqApiKey);
    console.log(">>> groqApiKey2", groqApiKey2);
    setGroqApiKey(groqApiKey || groqApiKey2);
    setIsSaved(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="groq-api-key">
        Groq API Key <small>You can get one <a href="https://console.groq.com/keys">here</a></small>
      </label>
      <fieldset role="group">
        <input
          type="password"
          id="groq-api-key"
          placeholder="Enter your API key"
          aria-invalid={isSaved ? "false" : undefined}
          aria-describedby={isSaved ? "valid-helper" : undefined}
          required
        />
        <input type="submit" value="Submit" />
      </fieldset>
      {isSaved && (
        <p>
          Your API key is saved!  <br />
          You can start using the extension now, selecting a text from a input field and clicking the extension icon.
        </p>
      )}
    </form>
  );
}

export default APIKeyForm;