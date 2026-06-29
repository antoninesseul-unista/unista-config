<template>
  <div class="flex flex-col gap-3">
    <CollapsibleSection label="Controller" v-model="uiState.showController">
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'controllerType',
            'driveReference',
            'hardwareReference',
            'motorReference',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3">
        <div>
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('controllerType') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Controller Type</label
          >
          <select
            v-model="axis.controllerType"
            @change="AxisSanitizer.onControllerChange(axis)"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('controllerType')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>
              -- Select Controller --
            </option>
            <option v-for="c in controllers" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </div>

        <div v-if="availableDrives.length > 0">
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('driveReference') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Drive Reference</label
          >
          <select
            v-model="axis.driveReference"
            @change="AxisSanitizer.onDriveChange(axis)"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('driveReference')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Drive --</option>
            <option v-for="d in availableDrives" :key="d" :value="d">
              {{ d }}
            </option>
          </select>
        </div>

        <div>
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('hardwareReference') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Hardware Reference</label
          >
          <select
            v-model="axis.hardwareReference"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('hardwareReference')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Hardware --</option>
            <option v-for="h in hardwareList" :key="h" :value="h">
              {{ h }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              class="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500"
              >Node Number</label
            >
            <input
              type="number"
              :value="axis.nodeNumber ?? ''"
              @input="setNumber('nodeNumber', $event)"
              placeholder="Auto from HW"
              disabled
              class="w-full px-2 py-1.5 border border-gray-200 bg-gray-100 rounded-md text-sm font-mono text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              class="block text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500"
              >Channel</label
            >
            <input
              type="number"
              :value="axis.channel ?? ''"
              @input="setNumber('channel', $event)"
              placeholder="Auto from HW"
              disabled
              class="w-full px-2 py-1.5 border border-gray-200 bg-gray-100 rounded-md text-sm font-mono text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div v-if="availableMotors.length > 0">
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('motorReference') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Motor Reference</label
          >
          <select
            v-model="axis.motorReference"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('motorReference')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Motor --</option>
            <option v-for="m in availableMotors" :key="m" :value="m">
              {{ m }}
            </option>
          </select>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection
      label="Configuration"
      v-model="uiState.showConfiguration"
    >
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'motionType',
            'units',
            'resolution',
            'encoderRotationDirection',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3">
        <div>
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('motionType') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Motion Type</label
          >
          <select
            v-model="axis.motionType"
            @change="AxisSanitizer.onMotionChange(axis)"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('motionType')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Motion --</option>
            <option v-for="m in availableMotions" :key="m" :value="m">
              {{ m }}
            </option>
          </select>
        </div>

        <div v-if="axis.controllerType !== 'INVERTER'">
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('units') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Units</label
          >
          <select
            v-model="axis.units"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('units')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Units --</option>
            <option v-for="u in availableUnits" :key="u" :value="u">
              {{ u }}
            </option>
          </select>
        </div>

        <div v-if="axis.controllerType === 'ACOPOS'">
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('resolution') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Resolution</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              step="0.001"
              :value="axis.resolution ?? ''"
              @input="setNumber('resolution', $event)"
              placeholder="Default: 0.01"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md text-sm font-mono outline-none transition-colors',
                hasError('resolution')
                  ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uPos }}</span
            >
          </div>
        </div>

        <div>
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('encoderRotationDirection')
                ? 'text-red-600'
                : 'text-gray-500',
            ]"
            >Encoder Direction</label
          >
          <select
            v-model="axis.encoderRotationDirection"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('encoderRotationDirection')
                ? 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>
              -- Select Direction --
            </option>
            <option value="CLOCKWISE">CLOCKWISE</option>
            <option value="COUNTER_CLOCKWISE">COUNTER_CLOCKWISE</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection label="Limits" v-model="uiState.showLimits">
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'lowerPosition',
            'upperPosition',
            'maxNegativeVelocity',
            'maxPositiveVelocity',
            'maxAcceleration',
            'maxDeceleration',
            'maxTorque',
            'stopTorque',
            'period',
            'followingError',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3 font-mono text-sm">
        <div
          v-if="AxisRuleProvider.isLimitFieldVisible('position', axis)"
          class="grid grid-cols-2 gap-2"
        >
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('lowerPosition') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Lower Pos.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.lowerPosition ?? ''"
                @input="setNumber('lowerPosition', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('lowerPosition')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uPos }}</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('upperPosition') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Upper Pos.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.upperPosition ?? ''"
                @input="setNumber('upperPosition', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('upperPosition')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uPos }}</span
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('maxNegativeVelocity')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Max Neg. Vel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.maxNegativeVelocity ?? ''"
                @input="setNumber('maxNegativeVelocity', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('maxNegativeVelocity')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uVel }}</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('maxPositiveVelocity')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Max Pos. Vel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.maxPositiveVelocity ?? ''"
                @input="setNumber('maxPositiveVelocity', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('maxPositiveVelocity')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uVel }}</span
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('maxAcceleration') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Max Accel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.maxAcceleration ?? ''"
                @input="setNumber('maxAcceleration', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('maxAcceleration')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uAcc }}</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('maxDeceleration') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Max Decel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.maxDeceleration ?? ''"
                @input="setNumber('maxDeceleration', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('maxDeceleration')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uAcc }}</span
              >
            </div>
          </div>
        </div>

        <div
          v-if="AxisRuleProvider.isLimitFieldVisible('maxTorque', axis)"
          class="grid grid-cols-2 gap-2"
        >
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('maxTorque') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Max Torque</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.maxTorque ?? ''"
                @input="setNumber('maxTorque', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-10 border rounded-md outline-none transition-colors font-mono',
                  hasError('maxTorque')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >Nm</span
              >
            </div>
          </div>
          <div v-if="AxisRuleProvider.isLimitFieldVisible('stopTorque', axis)">
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('stopTorque') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Stop Torque</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.stopTorque ?? ''"
                @input="setNumber('stopTorque', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-10 border rounded-md outline-none transition-colors font-mono',
                  hasError('stopTorque')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >Nm</span
              >
            </div>
          </div>
        </div>

        <div v-if="AxisRuleProvider.isLimitFieldVisible('period', axis)">
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('period') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Period</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.period ?? ''"
              @input="setNumber('period', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                hasError('period')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uPos }}</span
            >
          </div>
        </div>

        <div
          v-if="AxisRuleProvider.isLimitFieldVisible('followingError', axis)"
        >
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('followingError') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Following Error</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.followingError ?? ''"
              @input="setNumber('followingError', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                hasError('followingError')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uPos }}</span
            >
          </div>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection label="Default Values" v-model="uiState.showDefaults">
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'defaultVelocity',
            'defaultAcceleration',
            'defaultDeceleration',
            'defaultDirection',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3 font-mono text-sm">
        <div>
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('defaultVelocity') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Default Velocity</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.defaultVelocity ?? ''"
              @input="setNumber('defaultVelocity', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono text-sm',
                hasError('defaultVelocity')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uVel }}</span
            >
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('defaultAcceleration')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Default Accel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.defaultAcceleration ?? ''"
                @input="setNumber('defaultAcceleration', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono text-sm',
                  hasError('defaultAcceleration')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uAcc }}</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('defaultDeceleration')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Default Decel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.defaultDeceleration ?? ''"
                @input="setNumber('defaultDeceleration', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono text-sm',
                  hasError('defaultDeceleration')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uAcc }}</span
              >
            </div>
          </div>
        </div>

        <div>
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('defaultDirection') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Direction Strategy</label
          >
          <select
            v-model="axis.defaultDirection"
            :class="[
              'w-full px-2 py-1.5 border rounded-md font-sans text-sm outline-none transition-colors',
              hasError('defaultDirection')
                ? 'border-red-400 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Strategy --</option>
            <option value="DIR_POSITIVE">DIR_POSITIVE</option>
            <option value="DIR_NEGATIVE">DIR_NEGATIVE</option>
            <option value="DIR_CURRENT">DIR_CURRENT</option>
            <option value="DIR_SHORTEST_WAY">DIR_SHORTEST_WAY</option>
            <option value="DIR_EXCEED_PERIOD">DIR_EXCEED_PERIOD</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection label="Reduction" v-model="uiState.showReduction">
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError(['gearboxInput', 'gearboxOutput', 'transformation'])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3 font-mono text-sm">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('gearboxInput') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Gearbox In</label
            >
            <input
              type="number"
              :value="axis.gearboxInput ?? ''"
              @input="setNumber('gearboxInput', $event)"
              :class="[
                'w-full px-2 py-1.5 border rounded-md outline-none transition-colors font-mono',
                hasError('gearboxInput')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('gearboxOutput') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Gearbox Out</label
            >
            <input
              type="number"
              :value="axis.gearboxOutput ?? ''"
              @input="setNumber('gearboxOutput', $event)"
              :class="[
                'w-full px-2 py-1.5 border rounded-md outline-none transition-colors font-mono',
                hasError('gearboxOutput')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
          </div>
        </div>

        <div v-if="AxisRuleProvider.isTransformationVisible(axis)">
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('transformation') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Transformation</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.transformation ?? ''"
              @input="setNumber('transformation', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                hasError('transformation')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uPos }}</span
            >
          </div>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="AxisRuleProvider.isSectionVisible('homing', axis)"
      label="Homing"
      v-model="uiState.showHoming"
    >
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'homingType',
            'homingPosition',
            'homingDirection',
            'homingVelocity',
            'homingStartVelocity',
            'homingAcceleration',
            'homingTorqueLimit',
            'homingFollowingError',
            'homingBackoffDistance',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3 font-mono text-sm">
        <div>
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('homingType') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Homing Type</label
          >
          <select
            v-model="axis.homingType"
            :class="[
              'w-full px-2 py-1.5 border rounded-md font-sans text-sm outline-none transition-colors',
              hasError('homingType')
                ? 'border-red-400 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Homing --</option>
            <option v-for="h in availableHomings" :key="h" :value="h">
              {{ h }}
            </option>
          </select>
        </div>

        <div>
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('homingPosition') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Position</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.homingPosition ?? ''"
              @input="setNumber('homingPosition', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                hasError('homingPosition')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uPos }}</span
            >
          </div>
        </div>

        <div v-if="AxisRuleProvider.isHomingFieldVisible('direction', axis)">
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('homingDirection') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Homing Direction</label
          >
          <select
            v-model="axis.homingDirection"
            :class="[
              'w-full px-2 py-1.5 border rounded-md font-sans text-sm outline-none transition-colors',
              hasError('homingDirection')
                ? 'border-red-400 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>
              -- Select Direction --
            </option>
            <option value="NEGATIVE">NEGATIVE</option>
            <option value="POSITIVE">POSITIVE</option>
          </select>
        </div>

        <div
          v-if="AxisRuleProvider.isHomingFieldVisible('velocity', axis)"
          class="grid grid-cols-2 gap-2"
        >
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('homingVelocity') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Homing Vel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.homingVelocity ?? ''"
                @input="setNumber('homingVelocity', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono text-sm',
                  hasError('homingVelocity')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uVel }}</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('homingStartVelocity')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Start Vel.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.homingStartVelocity ?? ''"
                @input="setNumber('homingStartVelocity', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono text-sm',
                  hasError('homingStartVelocity')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uVel }}</span
              >
            </div>
          </div>
        </div>

        <div v-if="AxisRuleProvider.isHomingFieldVisible('acceleration', axis)">
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('homingAcceleration') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Homing Acceleration</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.homingAcceleration ?? ''"
              @input="setNumber('homingAcceleration', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                hasError('homingAcceleration')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uAcc }}</span
            >
          </div>
        </div>

        <div
          v-if="AxisRuleProvider.isHomingFieldVisible('torqueLimit', axis)"
          class="grid grid-cols-2 gap-2"
        >
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('homingTorqueLimit')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Torque Limit</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.homingTorqueLimit ?? ''"
                @input="setNumber('homingTorqueLimit', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-10 border rounded-md outline-none transition-colors font-mono',
                  hasError('homingTorqueLimit')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >Nm</span
              >
            </div>
          </div>
          <div
            v-if="AxisRuleProvider.isHomingFieldVisible('followingError', axis)"
          >
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('homingFollowingError')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Following Err.</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.homingFollowingError ?? ''"
                @input="setNumber('homingFollowingError', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                  hasError('homingFollowingError')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >{{ uPos }}</span
              >
            </div>
          </div>
        </div>

        <div v-if="AxisRuleProvider.isHomingFieldVisible('backoff', axis)">
          <label
            :class="[
              'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('homingBackoffDistance')
                ? 'text-red-600'
                : 'text-gray-500',
            ]"
            >Backoff Distance</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.homingBackoffDistance ?? ''"
              @input="setNumber('homingBackoffDistance', $event)"
              :class="[
                'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono',
                hasError('homingBackoffDistance')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >{{ uPos }}</span
            >
          </div>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="AxisRuleProvider.isSectionVisible('autoTune', axis)"
      label="Auto Tune"
      v-model="uiState.showAutoTune"
    >
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'autoTuneMode',
            'autoTuneOrientation',
            'autoTuneMaxCurrentPercentage',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3">
        <div>
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('autoTuneMode') ? 'text-red-600' : 'text-gray-500',
            ]"
            >Tune Mode</label
          >
          <select
            v-model="axis.autoTuneMode"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('autoTuneMode')
                ? 'border-red-400 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>-- Select Mode --</option>
            <option value="AXIS_TUNE_AUTOMATIC">AXIS_TUNE_AUTOMATIC</option>
            <option value="AXIS_TUNE_SPEED">AXIS_TUNE_SPEED</option>
            <option value="AXIS_TUNE_POSITION">AXIS_TUNE_POSITION</option>
            <option value="AXIS_TUNE_FEED_FORWARD">
              AXIS_TUNE_FEED_FORWARD
            </option>
          </select>
        </div>

        <div>
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('autoTuneOrientation')
                ? 'text-red-600'
                : 'text-gray-500',
            ]"
            >Orientation</label
          >
          <select
            v-model="axis.autoTuneOrientation"
            :class="[
              'w-full px-2 py-1.5 border rounded-md text-sm outline-none transition-colors',
              hasError('autoTuneOrientation')
                ? 'border-red-400 bg-red-50 text-red-900'
                : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
            ]"
          >
            <option :value="null" disabled hidden>
              -- Select Orientation --
            </option>
            <option value="HORIZONTAL">HORIZONTAL</option>
            <option value="VERTICAL">VERTICAL</option>
          </select>
        </div>

        <div v-if="AxisRuleProvider.isAutoTuneMaxCurrentVisible(axis)">
          <label
            :class="[
              'block text-[11px] font-bold uppercase tracking-wider mb-1',
              hasError('autoTuneMaxCurrentPercentage')
                ? 'text-red-600'
                : 'text-gray-500',
            ]"
            >Max Current (%)</label
          >
          <div class="relative flex items-center">
            <input
              type="number"
              :value="axis.autoTuneMaxCurrentPercentage ?? ''"
              @input="setNumber('autoTuneMaxCurrentPercentage', $event)"
              placeholder="Default: 80"
              :class="[
                'w-full px-2 py-1.5 pr-10 border rounded-md text-sm font-mono outline-none transition-colors',
                hasError('autoTuneMaxCurrentPercentage')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
            <span
              class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
              >%</span
            >
          </div>
        </div>
      </div>
    </CollapsibleSection>

    <CollapsibleSection
      v-if="AxisRuleProvider.isSectionVisible('inverter', axis)"
      label="Inverter"
      v-model="uiState.showInverter"
    >
      <template #icon>
        <svg
          class="w-3.5 h-3.5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12h4l3-9 5 18 3-9h4"
          />
        </svg>
      </template>

      <template
        #badge
        v-if="
          hasSectionError([
            'inverterPowerW',
            'inverterCosPhi',
            'inverterVoltageV',
            'inverterCurrentA',
            'inverterMotorSpeedRpm',
            'inverterMaxFrequencyHz',
          ])
        "
      >
        <span
          class="relative flex h-2 w-2 ml-1 shrink-0"
          title="Missing required field"
        >
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
      </template>

      <div class="space-y-3 font-mono text-sm">
        <div
          class="flex items-center justify-between bg-gray-50 p-2.5 rounded border border-gray-200 font-sans"
        >
          <span class="text-xs font-bold text-gray-700 uppercase tracking-wider"
            >Enable 60 Hz Mode</span
          >
          <input
            type="checkbox"
            v-model="axis.inverterEnable60Hz"
            class="w-4 h-4 accent-blue-600 rounded cursor-pointer"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('inverterPowerW') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Power (W)</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.inverterPowerW ?? ''"
                @input="setNumber('inverterPowerW', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-8 border rounded-md outline-none transition-colors font-mono',
                  hasError('inverterPowerW')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >W</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('inverterCosPhi') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Cos Phi</label
            >
            <input
              type="number"
              step="0.01"
              :value="axis.inverterCosPhi ?? ''"
              @input="setNumber('inverterCosPhi', $event)"
              :class="[
                'w-full px-2 py-1.5 border rounded-md outline-none transition-colors font-mono',
                hasError('inverterCosPhi')
                  ? 'border-red-400 bg-red-50 text-red-900'
                  : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
              ]"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('inverterVoltageV') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Voltage (V)</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.inverterVoltageV ?? ''"
                @input="setNumber('inverterVoltageV', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-8 border rounded-md outline-none transition-colors font-mono',
                  hasError('inverterVoltageV')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >V</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('inverterCurrentA') ? 'text-red-600' : 'text-gray-500',
              ]"
              >Current (A)</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                step="0.1"
                :value="axis.inverterCurrentA ?? ''"
                @input="setNumber('inverterCurrentA', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-8 border rounded-md outline-none transition-colors font-mono',
                  hasError('inverterCurrentA')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >A</span
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('inverterMotorSpeedRpm')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Speed (RPM)</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.inverterMotorSpeedRpm ?? ''"
                @input="setNumber('inverterMotorSpeedRpm', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-12 border rounded-md outline-none transition-colors font-mono text-sm',
                  hasError('inverterMotorSpeedRpm')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >RPM</span
              >
            </div>
          </div>
          <div>
            <label
              :class="[
                'block font-sans text-[11px] font-bold uppercase tracking-wider mb-1',
                hasError('inverterMaxFrequencyHz')
                  ? 'text-red-600'
                  : 'text-gray-500',
              ]"
              >Max Freq. (Hz)</label
            >
            <div class="relative flex items-center">
              <input
                type="number"
                :value="axis.inverterMaxFrequencyHz ?? ''"
                @input="setNumber('inverterMaxFrequencyHz', $event)"
                :class="[
                  'w-full px-2 py-1.5 pr-10 border rounded-md outline-none transition-colors font-mono text-sm',
                  hasError('inverterMaxFrequencyHz')
                    ? 'border-red-400 bg-red-50 text-red-900'
                    : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-500',
                ]"
              />
              <span
                class="absolute right-2 text-[11px] text-gray-400 font-sans pointer-events-none select-none"
                >Hz</span
              >
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import CollapsibleSection from "../../components/CollapsibleSection.vue";
import { AxisRuleProvider } from "../../domain/axis/axisRuleProvider";
import { AxisSanitizer } from "../../domain/axis/axisSanitizer";
import { hardwareProvider } from "../../services/hardware/hardwareProvider";

const props = defineProps<{
  axis: any;
  hasError: (field: string) => boolean;
}>();

const uiState = reactive({
  showController: true,
  showConfiguration: true,
  showLimits: false,
  showDefaults: false,
  showReduction: false,
  showHoming: false,
  showAutoTune: false,
  showInverter: false,
});

const controllers = computed(() => AxisRuleProvider.getAvailableControllers());
const availableDrives = computed(() =>
  AxisRuleProvider.getAvailableDrives(props.axis.controllerType || ""),
);
const availableMotors = computed(() =>
  AxisRuleProvider.getAvailableMotors(
    props.axis.controllerType || "",
    props.axis.driveReference || "",
  ),
);
const availableMotions = computed(() =>
  AxisRuleProvider.getAvailableMotionTypes(props.axis.controllerType || ""),
);
const availableUnits = computed(() =>
  AxisRuleProvider.getAvailableUnits(props.axis.motionType || ""),
);
const availableHomings = computed(() =>
  AxisRuleProvider.getAvailableHomingTypes(
    props.axis.controllerType || "",
    props.axis.driveReference || "",
  ),
);
const hardwareList = computed(() => hardwareProvider.getReferences());

const uPos = computed((): string => {
  switch (props.axis.units) {
    case "DEGREES":
      return "°";
    case "RADIANS":
      return "rad";
    case "REVOLUTIONS":
      return "rev";
    case "METERS":
      return "m";
    case "INCHES":
      return "in";
    default:
      return "mm";
  }
});

const uVel = computed((): string => `${uPos.value}/s`);
const uAcc = computed((): string => `${uPos.value}/s²`);

const setNumber = (field: string, event: Event): void => {
  const val = (event.target as HTMLInputElement).value;
  props.axis[field] = val === "" ? null : Number(val);
};

const hasSectionError = (fields: string[]): boolean =>
  fields.some((f) => props.hasError(f));

onMounted(() => {
  AxisSanitizer.hydrateDefaults(props.axis);
});
</script>
