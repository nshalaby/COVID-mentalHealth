'use strict';
const e = React.createElement;


function StackedAreaChart({  }) {
    const svgRef = React.useRef();

    const useResizeObserver = ref => {
        const [dimensions, setDimensions] = React.useState(null);

        React.useEffect(() => {
          const observeTarget = ref.current;
          const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
              setDimensions(entry.contentRect);
            });
          });
          resizeObserver.observe(observeTarget);
          return () => {
            resizeObserver.unobserve(observeTarget);
          };
        }, [ref]);
        return dimensions;
      };


    const wrapperRef = React.useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [currentZoomState, setCurrentZoomState] = React.useState(null);



    
    
    const allKeys = ["suicidewatch", "addiction", "covid19_total_cases"];
    
    const colors = {
      

      
      
      "suicidewatch": "green",
      "addiction": "orange",
      "covid19_total_cases": "purple"

      
    };
    const [keys, setKeys] = React.useState(allKeys);

    /*
    
    const[data_addiction_2018, set_data_addiction_2018] = React.useState([]);

    const[data_addiction_2019, set_data_addiction_2019] = React.useState([]);
    const[data_addiction_2020, set_data_addiction_2020] = React.useState([]);
    const[covid_cases, set_covid_cases] = React.useState([]);
    const[data_suicide_2018, set_data_suicide_2018] = React.useState([]);
    const[data_suicide_2019, set_data_suicide_2019] = React.useState([]);
    const[data_suicide_2020, set_data_suicide_2020] = React.useState([]);
    */

   /* d3.csv('./dataMH/addiction_2018_features_tfidf_256.csv').then(data_addiction_2018 => {
        console.log(data_addiction_2018)
        
        set_data_addiction_2018(data_addiction_2018)
    })

    d3.csv('./dataMH/addiction_2019_features_tfidf_256.csv').then(data_addiction_2019 => {
        console.log(data_addiction_2019)

        set_data_addiction_2019(data_addiction_2019)
    })

    d3.csv('./dataMH/addiction_post_features_covid19_counts.csv').then(data_addiction_2020 => {
        console.log(data_addiction_2020)
        set_data_addiction_2020(data_addiction_2020)
        console.log(data_addiction_2020.length)
    })

    d3.csv('./dataMH/covid19_total_cases.csv').then(covid_cases => {
        console.log(covid_cases)
        set_covid_cases(covid_cases)
    })

    d3.csv('./dataMH/suicidewatch_2018_features_tfidf_256.csv').then(data_suicide_2018 => {
        console.log(data_suicide_2018)
        set_data_suicide_2018(data_suicide_2018)
        
    })

    d3.csv('./dataMH/suicidewatch_2019_features_tfidf_256.csv').then(data_suicide_2019 => {
        console.log(data_suicide_2019)

        set_data_suicide_2019(data_suicide_2019)
    })

    d3.csv('./dataMH/suicidewatch_post_features_covid19_counts.csv').then(data_suicide_2020 => {
        console.log(data_suicide_2020)

        set_data_suicide_2020(data_suicide_2020)
    })*/


    const [data, setData] = React.useState([
        {
          year: 2018,
          "suicidewatch": 10215,
          "addiction": 502,
          "covid19_total_cases": 0
        },
        {
          year: 2019,
          "suicidewatch": 14592,
          "addiction": 1257,
          "covid19_total_cases": 27
        },
        {
          year: 2020,
          "suicidewatch": 21410,
          "addiction": 1783,
          "covid19_total_cases": 1123580 // average of the data I included in 2020 world wide
        },
       
      ]);

    // will be called initially and on every data change
    React.useEffect(() => {
        const svg = d3.select(svgRef.current);
        const { width, height } =
        dimensions || wrapperRef.current.getBoundingClientRect();

        var margin = {
            'top'    : 5,
            'right'  : 200,
            "bottom" : 120,
            "left"   : 120
        };

        // stacks / layers
        const stackGenerator = d3.stack()
        .keys(keys)
        .order(d3.stackOrderAscending);
        const layers = stackGenerator(data);
        const extent = [
        0,
        d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))
        ];

        // scales
        const xScale = d3.scalePoint()
        .domain(data.map(d => d.year))
        .range([margin.left, width - margin.right]);

        

        const yScale = d3.scaleLinear()
        .domain(extent)
        .range([height - margin.top - margin.bottom, 0])
        .clamp(true)

        if(currentZoomState!=null)
        {
         const newYScale = currentZoomState.rescaleY(yScale)
         console.log(currentZoomState)
         yScale.domain(newYScale.domain())

        }

        // area generator
        const areaGenerator = d3.area()
        .x(sequence => xScale(sequence.data.year))
        .y0(sequence => yScale(sequence[0]))
        .y1(sequence => yScale(sequence[1]))
        .curve(d3.curveCardinal);

        // rendering
        svg
        .selectAll(".layer")
        .data(layers)
        .join("path")
        .attr("class", "layer")
        .attr("fill", layer => colors[layer.key])
        .attr("d", areaGenerator);

        // axes
        const xAxis = d3.axisBottom(xScale);
        svg
        .select(".x-axis")
        .attr("transform", 'translate(0,' + (height - margin.bottom - margin.top) + ')')
        .call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg
        .select(".y-axis")
        .attr("transform", 'translate(' + margin.left + ',0)')
        
        .call(yAxis);


        // zoom function

        const zoomBehaviour = d3.zoom()
        .scaleExtent([.5, 1000])
        .translateExtent([
            [0,0],
            [width, height]
        ])
        .on("zoom", () => {
            

            const zoomState = d3.zoomTransform(svg.node())

            setCurrentZoomState(zoomState);

            console.log(zoomState);
        });


        svg.call(zoomBehaviour)


    }, [colors, data, dimensions, keys, currentZoomState]);


    return (
        <React.Fragment>
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
          <svg ref={svgRef} height="300" width="1000">
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>

          <div className="fields">
        {allKeys.map(key => (
          <div key={key} className="field">
            <input
              id={key}
              type="checkbox"
              checked={keys.includes(key)}
              onChange={e => {
                if (e.target.checked) {
                  setKeys(Array.from(new Set([...keys, key])));
                } else {
                  setKeys(keys.filter(_key => _key !== key));
                }
              }}
            />
            <label htmlFor={key} style={{ color: colors[key] }}>
              {key}
            </label>
          </div>
        ))}
      </div>
        </div>
      </React.Fragment>
        
    );
}


ReactDOM.render(<StackedAreaChart  />, document.getElementById('stacked_area_chart'))