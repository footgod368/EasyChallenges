module Level1.Level1Init exposing (init)

{-| Init of Level1 Model.


# init

@docs init

-}

import Array exposing (Array)
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level1.Level1Type as Level1Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event exposing (Event)
import Modules.GameControl as GameControl
import Modules.Monster as Monster
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Modules.Sound as Sound
import Task


{-| `init` of Level1 \`Model
-}
init : () -> ( Level1Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 80 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitLineSeg 1 "first falling ground" (GlobalBasics.blockPosFloat ( 6, 12.5 )) (GlobalBasics.blockPosFloat ( 6, 15 ))
                    , Event.hitLineSeg 2 "first ?" ( 564, 491 ) ( 604, 491 )
                    , Event.hitLineSeg 3 "first falling needles" (GlobalBasics.blockPosFloat ( 23, 13 )) (GlobalBasics.blockPosFloat ( 23, 20 ))
                    , Event.hitLineSeg 4 "second ?" (GlobalBasics.blockPosFloat ( 24.1, 10 )) (GlobalBasics.blockPosFloat ( 24.9, 10 ))
                    , Event.hitBlock 5 "first hidden brick" ( 4.5, 12 ) ( 1, 1 )
                    , Event.hitBlock 6 "second hidden brick" ( 5.5, 12 ) ( 1, 1 )
                    , Event.hitBlock 7 "third hidden brick" ( 32.5, 12 ) ( 1, 1 )
                    , Event.hitBlock 8 "fourth hidden brick" ( 33.5, 12 ) ( 1, 1 )
                    , Event.hitLineSeg 9 "first hidden needles" (GlobalBasics.blockPosFloat ( 31, 9.26 )) (GlobalBasics.blockPosFloat ( 37, 9.26 ))
                    , Event.hitLineSeg 9 "first hidden needles" (GlobalBasics.blockPosFloat ( 31, 8.99 )) (GlobalBasics.blockPosFloat ( 37, 8.99 ))
                    , Event.hitBlock 10 "fifth hidden brick" ( 44, 12 ) ( 1, 1 )
                    , Event.hitBlock 11 "sixth hidden brick" ( 45, 12 ) ( 1, 1 )
                    , Event.init
                        { id = 12, name = "sword" }
                        (Event.AfterActEvent 10)
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon (Array.fromList [ ( GlobalBasics.blockPosFloat ( 46, 1 ), GlobalBasics.blockPosFloat ( 46, 15 ) ) ]))
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 12, name = "sword" }
                        (Event.AfterActEvent 11)
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon (Array.fromList [ ( GlobalBasics.blockPosFloat ( 46, 1 ), GlobalBasics.blockPosFloat ( 46, 15 ) ) ]))
                        )
                        (Event.quickDuration 10)
                    ]
            , boundary = Boundary.normalInit
            , playerAtLastSavePoint = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , player = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , bricks =
                Array.fromList
                    (List.concat
                        [ [ NoticeBoard.boundary ( 2, 5 ) ( 7, 4 ) ]
                        , Brick.initRow 15 1 4
                        , Brick.initFallingRow 15 5 8 1
                        , Brick.initRow 15 9 32
                        , Brick.initRow 12 22 26
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 15, 12 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 24, 9 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.initCollideHidden ( 22, 8 ) 4
                          , Brick.initCollideHidden ( 23, 8 ) 4
                          , Brick.initCollideHidden ( 24, 8 ) 4
                          , Brick.initCollideHidden ( 25, 8 ) 4
                          , Brick.initCollideHidden ( 26, 8 ) 4
                          , Brick.initCollideHidden ( 22, 9 ) 4
                          , Brick.initCollideHidden ( 26, 9 ) 4
                          , Brick.initCollideHidden ( 26, 10 ) 4
                          , Brick.initCollideHidden ( 26, 11 ) 4
                          , Brick.initCollideHidden ( 22, 10 ) 4
                          , Brick.initCollideHidden ( 22, 11 ) 4
                          ]
                        , [ Brick.initNoCollideHidden ( 4.5, 12 ) 5
                          , Brick.initNoCollideHidden ( 5.5, 12 ) 6
                          ]
                        , Brick.initRow 15 36 80
                        , [ NoticeBoard.boundary ( 31, 5 ) ( 7, 4 ) ]
                        , [ Brick.initNoCollideHidden ( 32.5, 12 ) 7
                          , Brick.initNoCollideHidden ( 33.5, 12 ) 8
                          ]
                        , [ Brick.initNoCollideHidden ( 44, 12 ) 10
                          , Brick.initNoCollideHidden ( 45, 12 ) 11
                          ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 55, 11.5 )) ( 2.0 * 40.0, 3.5 * 40.0 ) "#008000"
                          , Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 67, 11.5 )) ( 2.0 * 40.0, 3.5 * 40.0 ) "#008000"
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 41, 14 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 76, 14 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 5.5, 7.5 )) "Welcome!" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 34.5, 7.5 )) "Caution!" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 15.5, 12.85 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 24.5, 9.85 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 15.0, 7.0 )) "Press R to respawn" 40
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ [ Needle.initHidden ( 15, 13 ) 2 Needle.Downwards]
                        , Needle.initFallingRow 13 22 26 3 Needle.Downwards
                        , [ Needle.initHiddenCollideAfter ( 25, 12 ) 4 Needle.Upwards]
                        , Needle.initHiddenRow 9 31 37 9 Needle.Downwards

                        -- , [ Needle.initPos (GlobalBasics.blockPosFloat ( 46.0, 14.75 ))
                        --   , Needle.initPos (GlobalBasics.blockPosFloat ( 47.0, 14.75 ))
                        --   , Needle.initPos (GlobalBasics.blockPosFloat ( 48.0, 14.75 ))
                        --   , Needle.initPos (GlobalBasics.blockPosFloat ( 49.0, 14.75 ))
                        --   ]
                        , let
                            tempSword =
                                Needle.sword ( 46, 14.75 ) ( 46, -2 ) ( 4, 0.25 ) 6.0 12 Needle.Upwards
                          in
                          [ { tempSword
                                | visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
                                , collision = GlobalModule.Collide GlobalModule.NoNextCollision
                            }
                          ]
                        ]
                    )
            , monsters =
                Array.fromList
                    [ Monster.init (GlobalBasics.blockPosFloat ( 66, 14 ))
                        (Monster.MonsterA 40 40)
                        (Monster.ListenX 300)
                        (Monster.ListenY 300)
                        1
                        ( 56 * 40, 65 * 40 )
                    ]
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level2 [["To circumvent the moonster,","jump back onto the first tunnel","and then jump over the monster."]]
            , sound =
                Sound.init [
                    Sound.Event 2 Sound.RandomBox
                ,   Sound.Event 3 Sound.Needle
                ,   Sound.Event 4 Sound.RandomBox
                ,   Sound.Event 5 Sound.RandomBox
                ,   Sound.Event 6 Sound.RandomBox
                ,   Sound.Event 7 Sound.RandomBox
                ,   Sound.Event 8 Sound.RandomBox
                ,   Sound.Event 9 Sound.Needle
                ,   Sound.Event 10 Sound.RandomBox
                ,   Sound.Event 11 Sound.RandomBox
                ]
            , mainScene = MainType.Level1
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
