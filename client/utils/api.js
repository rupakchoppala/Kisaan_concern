export const predictDisease = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData
    });
    return res.json();
  };
  