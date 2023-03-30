const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.querySelector("#user");
  const password = document.querySelector("#password");

  const submitBtn = document.getElementById("submit-btn");

  if (!user.value || !password.value)
    return form.classList.add("was-validated");

  try {
    submitBtn.innerHTML =
      "<span class='spinner-grow m-auto spinner-grow-sm' role='status' aria-hidden='true'></span> ";

    const res = await axios.post("/auth", {
      matricula: user.value,
      senha: password.value,
    });

    if (res.status === 200) {
      Swal.fire({
        title: res.data.message,
        icon: "success",
        html: "Redirecionando em... <strong></strong> segundos.<br/><br/>",
        timer: 5000,
        didOpen: () => {
          const content = Swal.getHtmlContainer();
          const $ = content.querySelector.bind(content);

          Swal.showLoading();

          function toggleButtons() {
            stop.disabled = !Swal.isTimerRunning();
            resume.disabled = Swal.isTimerRunning();
          }

          timerInterval = setInterval(() => {
            Swal.getHtmlContainer().querySelector("strong").textContent = (
              Swal.getTimerLeft() / 1000
            ).toFixed(0);
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
          window.location.href = "/sistemas/pdi/main";
        },
      });
    }
  } catch (error) {
    console.log(error);

    Swal.fire({
      title: "Ops!",
      text: error.response.data.message,
      icon: "error",
      confirmButtonText: "Certo",
    }).then(() => {
      (user.value = ""),
        (password.value = ""),
        (submitBtn.innerHTML = "Entrar");
    });
  }
});
