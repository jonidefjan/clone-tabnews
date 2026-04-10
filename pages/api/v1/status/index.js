function status(request, response) {
  response.status(200).json({ status: "success" });
}

export default status;
