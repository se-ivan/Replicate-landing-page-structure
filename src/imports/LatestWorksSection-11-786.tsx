import svgPaths from "./svg-o9brtcyt5s";
import imgImagePrepararteParaLaJubilacion from "figma:asset/5c5162ff2ef81dab0c03f8a327d2df3fecfd32c9.png";
import imgImageProtegeTusBienes from "figma:asset/975600876e13c319f7e80fe971f03f5e526ff0b1.png";
import imgImageCambioDeIdentidad from "figma:asset/ff7810a77d9b24cae7557a2e30741c7541212a5e.png";
import imgImageTusDerechosEnSalud from "figma:asset/e3e591fb4f5ec1f6c7aa0454bca82d554e08dfa4.png";

function Text() {
  return (
    <div className="h-[19.995px] relative shrink-0 w-[126.273px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(26,46,26,0.7)] top-[0.01px] tracking-[1.4px] uppercase whitespace-nowrap">[ Artículos ]</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[19.995px] relative shrink-0 w-[116.716px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute decoration-solid font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#1a2e1a] text-[14px] top-[0.01px] underline whitespace-nowrap">Ver Más Artículos</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[19.995px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text />
          <Link />
        </div>
      </div>
    </div>
  );
}

function ImagePrepararteParaLaJubilacion() {
  return (
    <div className="absolute h-[519.995px] left-0 top-0 w-[495.764px]" data-name="Image (PREPARARTE PARA LA JUBILACIÓN)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImagePrepararteParaLaJubilacion} />
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.7)] h-[519.995px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.2)] w-[495.764px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.995 19.995">
        <g id="Icon">
          <path d={svgPaths.p14451840} id="Vector" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
          <path d={svgPaths.p36d5e980} id="Vector_2" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[435.77px] pl-[9.997px] pr-[10.005px] rounded-[16878500px] size-[39.998px] top-[19.99px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border-[0.503px] border-[rgba(255,255,255,0.5)] border-solid h-[24.994px] left-0 rounded-[16878500px] top-0 w-[83.045px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[11.99px] not-italic text-[12px] text-white top-[4.5px] whitespace-nowrap">Psicología</p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border-[0.503px] border-[rgba(255,255,255,0.5)] border-solid h-[24.994px] left-[91.04px] rounded-[16878500px] top-0 w-[82.872px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[11.99px] not-italic text-[12px] text-white top-[4.5px] whitespace-nowrap">Jubilación</p>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border-[0.503px] border-[rgba(255,255,255,0.5)] border-solid h-[24.994px] left-[181.9px] rounded-[16878500px] top-0 w-[78.4px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[11.99px] not-italic text-[12px] text-white top-[4.5px] whitespace-nowrap">Bienestar</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border-[0.503px] border-[rgba(255,255,255,0.5)] border-solid h-[24.994px] left-[268.3px] rounded-[16878500px] top-0 w-[57.879px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[11.99px] not-italic text-[12px] text-white top-[4.5px] whitespace-nowrap">Retiro</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[24.994px] left-[19.99px] top-[19.99px] w-[326.176px]" data-name="Container">
      <Text1 />
      <Text2 />
      <Text3 />
      <Text4 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[79.98px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[40px] left-0 not-italic text-[32px] text-white top-[-0.5px] w-[448px]">PREPARARTE PARA LA JUBILACIÓN</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[68.238px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.7)] top-[0.52px] w-[448px]">Por qué prepararte psicológicamente para la jubilación. La reorganización personal y social que implica dejar la vida laboral activa.</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.993px] h-[204.202px] items-start left-0 pt-[23.996px] px-[23.996px] top-[315.79px] w-[495.764px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[519.995px] left-0 overflow-clip rounded-[24px] top-0 w-[495.764px]" data-name="Container">
      <ImagePrepararteParaLaJubilacion />
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function ImageProtegeTusBienes() {
  return (
    <div className="absolute h-[519.995px] left-0 top-0 w-[225.352px]" data-name="Image (PROTEGE TUS BIENES)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageProtegeTusBienes} />
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.7)] h-[519.995px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.2)] w-[225.352px]" data-name="Container" />;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.995 19.995">
        <g id="Icon">
          <path d={svgPaths.p14451840} id="Vector" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
          <path d={svgPaths.p36d5e980} id="Vector_2" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[165.36px] pl-[9.997px] pr-[10.005px] rounded-[16878500px] size-[39.998px] top-[19.99px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[50.003px] left-[24px] top-[438px] w-[177.361px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25px] left-0 not-italic text-[20px] text-white top-[-1px] w-[178px]">PROTEGE TUS BIENES</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[519.995px] left-[511.76px] overflow-clip rounded-[24px] top-0 w-[225.352px]" data-name="Container">
      <ImageProtegeTusBienes />
      <Container8 />
      <Container9 />
      <Heading1 />
    </div>
  );
}

function ImageCambioDeIdentidad() {
  return (
    <div className="absolute h-[519.995px] left-0 top-0 w-[225.344px]" data-name="Image (CAMBIO DE IDENTIDAD)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageCambioDeIdentidad} />
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.7)] h-[519.995px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.2)] w-[225.344px]" data-name="Container" />;
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.995 19.995">
        <g id="Icon">
          <path d={svgPaths.p14451840} id="Vector" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
          <path d={svgPaths.p36d5e980} id="Vector_2" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[165.35px] pl-[9.997px] pr-[10.005px] rounded-[16878500px] size-[39.998px] top-[19.99px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[50.003px] left-[24px] top-[438px] w-[177.353px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25px] left-0 not-italic text-[20px] text-white top-[-1px] w-[178px]">CAMBIO DE IDENTIDAD</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[519.995px] left-[753.1px] overflow-clip rounded-[24px] top-0 w-[225.344px]" data-name="Container">
      <ImageCambioDeIdentidad />
      <Container11 />
      <Container12 />
      <Heading2 />
    </div>
  );
}

function ImageTusDerechosEnSalud() {
  return (
    <div className="absolute h-[519.995px] left-0 top-0 w-[225.344px]" data-name="Image (TUS DERECHOS EN SALUD)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageTusDerechosEnSalud} />
    </div>
  );
}

function Container14() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.7)] h-[519.995px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.2)] w-[225.344px]" data-name="Container" />;
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[19.995px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.995 19.995">
        <g id="Icon">
          <path d={svgPaths.p14451840} id="Vector" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
          <path d={svgPaths.p36d5e980} id="Vector_2" stroke="var(--stroke-0, #1A2E1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66625" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[165.35px] pl-[9.997px] pr-[10.005px] rounded-[16878500px] size-[39.998px] top-[19.99px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[50.003px] left-[24px] top-[438px] w-[177.353px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25px] left-0 not-italic text-[20px] text-white top-[-1px] w-[178px]">TUS DERECHOS EN SALUD</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[519.995px] left-[994.44px] overflow-clip rounded-[24px] top-0 w-[225.344px]" data-name="Container">
      <ImageTusDerechosEnSalud />
      <Container14 />
      <Container15 />
      <Heading3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[519.995px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container7 />
      <Container10 />
      <Container13 />
    </div>
  );
}

export default function LatestWorksSection() {
  return (
    <div className="bg-[#f5f2ec] content-stretch flex flex-col gap-[39.998px] items-start pt-[79.996px] px-[79.996px] relative size-full" data-name="LatestWorksSection">
      <Container />
      <Container1 />
    </div>
  );
}