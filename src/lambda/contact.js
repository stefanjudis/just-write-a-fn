exports.handler = async ({ email }) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Let's become serverless conductors!!!"
    })
  };
};
