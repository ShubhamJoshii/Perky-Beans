import { Oval } from "react-loader-spinner"

const TableHOC = ({ heading, loading }) => {
  return (
    // <div className='dashboard-product-box'>
    <>
      <h2 className="heading">Products</h2>
      <table className="table" role="table">
        {tableHeadings(heading)}
        {loading ? (
          <td colSpan="10">
            <Oval height="40" width="60" color="black" wrapperStyle={{}} wrapperClass="loading" visible={true} ariaLabel="oval-loading" secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
          </td>
        ) : (
          <>
          </>
        )}
      </table>
    </>
    // </div>
  )
}


const tableHeadings = (heading) => {
  return (
    <thead>
      <tr>
        {
          heading.map((curr) => {
            return <th>{curr}</th>
          })
        }
      </tr>
    </thead>

  )

}

export default TableHOC;