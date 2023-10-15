export default function Loading({height, bgColor}: {height: string, bgColor: string}) {

    return (
        <div className={`${height} ${bgColor} flex flex-col justify-center items-center gap-4`}>
          <div className="cssload-loader-inner">
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
          </div>
        </div>
    )
}
