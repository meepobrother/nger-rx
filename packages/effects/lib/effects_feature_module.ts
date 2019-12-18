import { NgModule, Inject } from '@nger/core';
import { EffectsRootModule } from './effects_root_module';
import { FEATURE_EFFECTS } from './tokens';

@NgModule({})
export class EffectsFeatureModule {
    constructor(
        root: EffectsRootModule,
        @Inject({ token: FEATURE_EFFECTS }) effectSourceGroups: any[][]
    ) {
        effectSourceGroups.forEach(group =>
            group.forEach(effectSourceInstance =>
                root.addEffects(effectSourceInstance)
            )
        );
    }
}
