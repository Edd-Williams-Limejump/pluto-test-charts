import "./Page.scss";

const Page = ({ title, children }) => (
  <div className="page">
    <h1 className="page__title">{title}</h1>
    <div className="page__content">{children}</div>
  </div>
);

export default Page;
