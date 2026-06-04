'use client';

import { useState } from 'react';
import { Shield, Cpu, Zap, Flame, Award, ArrowRight } from 'lucide-react';

const PRESETS = {
  stable: {
    name: '안정형 (Stable)',
    desc: '인프라와 병목 병렬 분산 중심. 위험 자산 노출 최소화.',
    musk: 10,
    power: 30,
    semicon: 25,
    cooling: 15,
    bess: 20,
  },
  default: {
    name: '기본형 (Default - 권장)',
    desc: 'KMC 기준 배분안. 머스크 알파와 핵심 인프라의 균형 성장.',
    musk: 20,
    power: 25,
    semicon: 25,
    cooling: 15,
    bess: 15,
  },
  aggressive: {
    name: '공격형 (Aggressive)',
    desc: '반도체/HBM 및 머스크 스택 비중 극대화로 고수익 지향.',
    musk: 25,
    power: 20,
    semicon: 30,
    cooling: 15,
    bess: 10,
  }
};

const SECTORS_INFO = [
  {
    id: 'musk',
    title: 'Musk Stack 검증 레이어',
    target: '20%',
    icon: Shield,
    color: '#8B5CF6',
    desc: '차별화 알파 레이어. Tesla, xAI, SpaceX와의 직접/간접 관계가 확인된 종목만 엄격히 검증하여 편입합니다.',
    rules: ['공식 공급 계약 또는 직접 문서 검증 필수', '루머 기반 C등급 이하 종목은 전체 포트폴리오 2% 제한']
  },
  {
    id: 'power',
    title: 'AI 전력 인프라 / Grid Bottleneck',
    target: '25%',
    icon: Zap,
    color: '#F59E0B',
    desc: '5년 장기 핵심. AI 데이터센터 및 산업 전력 수요 급증으로 전력 기기, 변압기, 송배전 선로 병목이 발생합니다.',
    rules: ['초고압 변압기 리드타임 및 백로그 확인', '북미 현지 공장 증설 및 수주 가시성 최우선']
  },
  {
    id: 'semicon',
    title: 'AI 반도체 / HBM / Advanced Packaging',
    target: '25%',
    icon: Cpu,
    color: '#3B82F6',
    desc: 'AI CAPEX 핵심 병목. 고성능 GPU와 결합되는 HBM3E/HBM4 및 2.5D/3D CoWoS 패키징, 첨단 기판 기술 수혜.',
    rules: ['고객사 인증 완료 단계 및 양산 수율 검증', '독점 장비 특허 및 밸류체인 지배력 검토']
  },
  {
    id: 'cooling',
    title: 'AI 데이터센터 전력/냉각 인프라',
    target: '15%',
    icon: Flame,
    color: '#EF4444',
    desc: '고밀도 랙 설치에 따른 열관리 병목 해결. Direct-to-Chip 액체 냉각, CDU, 모듈형 전력 PDU/UPS 등의 통합 엔지니어링.',
    rules: ['NVIDIA 랙 설계 표준 파트너십 여부', '액체냉각 전환율 및 데이터센터 PUE 기여율']
  },
  {
    id: 'bess',
    title: 'BESS / 전력 유연성 / ESS',
    target: '15%',
    icon: Award,
    color: '#10B981',
    desc: '계통망 병목 완화. 신재생에너지 결합 및 데이터센터 단독 백업 전원으로서 대용량 에너지 저장 장치(BESS) 필수 탑재.',
    rules: ['LFP/NMC 배터리 화재 리스크 및 안정성 인증', '에너지 관리 소프트웨어(EMS) 가치 연동']
  }
];

export default function PrinciplesTab() {
  const [selectedPreset, setSelectedPreset] = useState('default');
  const preset = PRESETS[selectedPreset];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* 5년 원칙 선언문 배너 */}
      <div className="panel" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '24px',
        padding: '40px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }} />
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '700', 
          color: 'var(--accent-light)', 
          textTransform: 'uppercase', 
          letterSpacing: '3px',
          display: 'inline-block',
          marginBottom: '16px'
        }}>
          KMC Investment Philosophy
        </span>
        <h1 className="logo-glow" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.4' }}>
          "테마를 사지 않는다. 검증된 병목을 산다."
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto', fontSize: '15px', lineHeight: '1.7', zIndex: 1, position: 'relative' }}>
          우리는 단기 시세 등락에 흔들리지 않으며, 향후 5년간 구조적으로 팽창할 AI 전력, 핵심 반도체 패키징, 
          데이터센터 열관리, 전력 저장 장치(BESS)의 병목을 장악하는 기업에 집중 투자합니다. 
          비공식 루머를 배제하고 오직 1차적 근거가 검증된 자산만 선별 배분합니다.
        </p>
      </div>

      {/* 포트폴리오 비중 프리셋 설정 */}
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 className="panel-title" style={{ marginBottom: '6px' }}>5년 자산 배분 기준안 설정</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>성향에 적합한 장기투자 포트폴리오 비중 가이드라인을 선택하십시오.</p>
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPreset(key)}
                style={{
                  background: selectedPreset === key ? 'var(--accent)' : 'transparent',
                  border: 0,
                  color: selectedPreset === key ? '#fff' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'var(--transition)'
                }}
              >
                {key === 'stable' ? '안정형' : key === 'default' ? '기본형' : '공격형'}
              </button>
            ))}
          </div>
        </div>

        {/* 프리셋 요약 및 차트 시뮬레이션 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 2fr',
          gap: '32px',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--accent-light)' }}>
              {preset.name}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              {preset.desc}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>포트폴리오 회전 주기</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>분기별 리밸런싱 검토</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>목표 투자 기간</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>최소 5년 (2026 ~ 2031)</span>
              </div>
            </div>
          </div>

          {/* 게이지 바 비중 시각화 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Musk Stack 검증 레이어', value: preset.musk, color: '#8B5CF6' },
              { label: 'AI 전력 인프라 / Grid Bottleneck', value: preset.power, color: '#F59E0B' },
              { label: 'AI 반도체 / HBM / Packaging', value: preset.semicon, color: '#3B82F6' },
              { label: 'AI 데이터센터 전력/냉각 인프라', value: preset.cooling, color: '#EF4444' },
              { label: 'BESS / 전력 유연성 / ESS', value: preset.bess, color: '#10B981' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: '500' }}>{item.label}</span>
                  <span style={{ fontWeight: '700', color: item.color }}>{item.value}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{
                    width: `${item.value}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '4px',
                    boxShadow: `0 0 10px ${item.color}80`,
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5대 섹터 가이드 카드 */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📘 5대 핵심 섹터 구조 가이드</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {SECTORS_INFO.map((sec, idx) => {
            const IconComponent = sec.icon;
            return (
              <div key={idx} className="panel hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '16px', transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    background: `rgba(${parseInt(sec.color.slice(1,3),16)}, ${parseInt(sec.color.slice(3,5),16)}, ${parseInt(sec.color.slice(5,7),16)}, 0.1)`,
                    border: `1px solid ${sec.color}30`,
                    color: sec.color,
                    padding: '10px',
                    borderRadius: '12px'
                  }}>
                    <IconComponent size={24} />
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: sec.color
                  }}>
                    기준 배분 비중: {sec.title === 'Musk Stack 검증 레이어' ? `${preset.musk}%` : 
                                    sec.title === 'AI 전력 인프라 / Grid Bottleneck' ? `${preset.power}%` :
                                    sec.title === 'AI 반도체 / HBM / Advanced Packaging' ? `${preset.semicon}%` :
                                    sec.title === 'AI 데이터센터 전력/냉각 인프라' ? `${preset.cooling}%` : `${preset.bess}%`}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{sec.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{sec.desc}</p>
                </div>

                <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: '4px 0' }} />

                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
                    🚨 편입 및 리밸런싱 핵심 규칙
                  </h4>
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {sec.rules.map((rule, rid) => (
                      <li key={rid} style={{ lineHeight: '1.5' }}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
