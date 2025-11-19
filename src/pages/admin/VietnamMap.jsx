import React, { useEffect, useRef } from "react";

const VietnamMap = ({ dealers = [] }) => {
  const chartRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        await loadScript("https://cdn.amcharts.com/lib/5/index.js");
        await loadScript("https://cdn.amcharts.com/lib/5/map.js");
        await loadScript("https://cdn.amcharts.com/lib/5/geodata/worldLow.js");
        await loadScript("https://cdn.amcharts.com/lib/5/themes/Animated.js");

        if (!window.am5) return;

        const am5 = window.am5;
        const am5map = window.am5map;
        const am5themes_Animated = window.am5themes_Animated;

        if (rootRef.current) {
          rootRef.current.dispose();
        }

        const root = am5.Root.new(chartRef.current);
        rootRef.current = root;

        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
          am5map.MapChart.new(root, {
            panX: "translateX",
            panY: "translateY",
            projection: am5map.geoMercator(),
            maxZoomLevel: 64,
            minZoomLevel: 1,
          })
        );

        const polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: window.am5geodata_worldLow,
            exclude: ["AQ"],
          })
        );

        polygonSeries.mapPolygons.template.setAll({
          fill: am5.color(0xe0e0e0),
          stroke: am5.color(0xffffff),
          strokeWidth: 1,
        });

        polygonSeries.mapPolygons.template.adapters.add(
          "fill",
          (fill, target) => {
            if (target.dataItem && target.dataItem.dataContext.id === "VN") {
              return am5.color(0x93c5fd);
            }
            return fill;
          }
        );

        // tạo điểm đại lý
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        pointSeries.bullets.push((root, series, dataItem) => {
          const container = am5.Container.new(root, {});

          const circle = container.children.push(
            am5.Circle.new(root, {
              radius: 8,
              fill: am5.color(0xef4444),
              stroke: am5.color(0xffffff),
              strokeWidth: 2,
              tooltipText: "{title}\n{dealers} đại lý",
              cursorOverStyle: "pointer",
            })
          );

          const label = container.children.push(
            am5.Label.new(root, {
              text: "{dealers}",
              fill: am5.color(0xffffff),
              centerX: am5.p50,
              centerY: am5.p50,
              fontSize: 10,
              fontWeight: "bold",
            })
          );

          circle.animate({
            key: "scale",
            from: 1,
            to: 1.3,
            duration: 1000,
            easing: am5.ease.yoyo(am5.ease.inOut(am5.ease.cubic)),
            loops: Infinity,
          });

          return am5.Bullet.new(root, {
            sprite: container,
          });
        });

        // vị trí các thành phố và đảo Việt Nam
        const vietnamCities = [
          {
            title: "TP. Hồ Chí Minh",
            latitude: 10.8231,
            longitude: 106.6297,
            dealers: dealers.find((d) => d.city === "Hồ Chí Minh")?.count || 0,
            type: "city",
          },
          {
            title: "Hà Nội",
            latitude: 21.0285,
            longitude: 105.8542,
            dealers: dealers.find((d) => d.city === "Hà Nội")?.count || 0,
            type: "city",
          },
          {
            title: "Đà Nẵng",
            latitude: 16.0544,
            longitude: 108.2022,
            dealers: dealers.find((d) => d.city === "Đà Nẵng")?.count || 0,
            type: "city",
          },
          {
            title: "Hải Phòng",
            latitude: 20.8449,
            longitude: 106.6881,
            dealers: dealers.find((d) => d.city === "Hải Phòng")?.count || 0,
            type: "city",
          },
          {
            title: "Cần Thơ",
            latitude: 10.0452,
            longitude: 105.7469,
            dealers: dealers.find((d) => d.city === "Cần Thơ")?.count || 0,
            type: "city",
          },
          {
            title: "Đảo Phú Quốc",
            latitude: 10.2899,
            longitude: 103.9833,
            dealers: dealers.find((d) => d.city === "Phú Quốc")?.count || 0,
            type: "island",
          },
          {
            title: "Quần đảo Hoàng Sa",
            latitude: 16.5,
            longitude: 112.0,
            dealers: 0,
            type: "territory",
          },
          {
            title: "Quần đảo Trường Sa",
            latitude: 10.0,
            longitude: 114.0,
            dealers: 0,
            type: "territory",
          },
        ];

        pointSeries.data.setAll(
          vietnamCities.map((city) => ({
            geometry: {
              type: "Point",
              coordinates: [city.longitude, city.latitude],
            },
            title: city.title,
            dealers: city.dealers,
          }))
        );

        chart.events.once("datavalidated", function () {
          chart.zoomToGeoPoint(
            {
              longitude: 106.6297,
              latitude: 14.5,
            },
            1,
            true
          );
        });

        // Animate on load
        chart.appear(1000, 100);
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    initMap();

    return () => {
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, [dealers]);

  return (
    <div
      ref={chartRef}
      className="w-full h-96 bg-white rounded-lg"
      style={{ minHeight: "400px" }}
    />
  );
};

export default VietnamMap;
