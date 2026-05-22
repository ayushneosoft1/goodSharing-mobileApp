import api from "./api";

export const getSubscriptions = async () => {
  const response = await api.post("", {
    query: `

query{

mySubscriptions

}

`,
  });

  return response.data.data.mySubscriptions;
};

export const updateSubscriptions = async (categories) => {
  const response = await api.post("", {
    query: `

mutation UpdateSubscriptions(
$categories:[PostCategory!]!
){

updateSubscriptions(

categories:$categories

)

}

`,

    variables: {
      categories,
    },
  });

  return response.data;
};

export const unsubscribeCategory = async (category) => {
  const response = await api.post("", {
    query: `

mutation Unsubscribe(

$category:PostCategory!

){

unsubscribeCategory(

category:$category

)

}

`,

    variables: {
      category,
    },
  });

  return response.data;
};
