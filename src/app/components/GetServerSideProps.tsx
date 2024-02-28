import Chat from "../mainPages/chatPage/page";

const GetServerSideProps = async() => {
    const apiKey: string | undefined = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    return <Chat openaiApiKey={apiKey} />
}

export default GetServerSideProps;